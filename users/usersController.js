const { getAllUsers, getUserById, registerNewUser, deleteUserById, editUserById, loginUser } = require("./usersModel")
    // const notNumber = require("../utils/notNumber")
const { hashPassword, checkPassword } = require("../utils/handlePassword")
const { tokenSign } = require("../utils/handleJWT")
const public_url = process.env.public_url
const fileUpload = require("../utils/handleStorage")
const { matchedData } = require("express-validator")


const register = async(req, res, next) => {
    const urlFile = `${public_url}/${req.file.filename}`
    const password = await hashPassword(req.body.password);
    console.log(req.body); //show this...
    const bodyClean = matchedData(req); //....this
    console.log(bodyClean); //...and this
    const dbResponse = await registerNewUser({...bodyClean, image: urlFile, password });
    if (dbResponse instanceof Error) return next(dbResponse);
    const user = {
        name: bodyClean.name,
        email: bodyClean.email
    }

    const tokenData = {
        token: await tokenSign(user),
        user
    }
    res.status(201).json({ message: "User created!", JWT_Info: tokenData });

};


const login = async(req, res, next) => {
    const dbResponse = await loginUser(req.body.email);
    if (!dbResponse.length) return next();
    if (await checkPassword(req.body.password, dbResponse[0].password)) {
        const user = {
            id: dbResponse[0].id,
            name: dbResponse[0].name,
            email: dbResponse[0].email,
            image: dbResponse[0].image
        }
        const tokenData = {
            token: await tokenSign(user),
            user: user
        }

        res.status(200).json({ message: `User ${user.name} Logged In!`, JWT_Info: tokenData })
    } else {
        const error = {
            status: 401,
            message: "Unauthorized",
        };
        next(error);
    }
};
const listAll = async(req, res, next) => {
    const dbResponse = await getAllUsers();
    if (dbResponse instanceof Error) return next(dbResponse);
    dbResponse.length ? res.status(200).json(dbResponse) : next();
};

const listOne = async(req, res, next) => {
    if (notNumber(+req.params.id, next)) return
    const dbResponse = await getUserById(+req.params.id);
    if (dbResponse instanceof Error) return next(dbResponse);
    dbResponse.length ? res.status(200).json(dbResponse) : next();
};
const editOne = async(req, res, next) => {
    if (notNumber(+req.params.id, next)) return
    const password = await hashPassword(req.body.password);
    const bodyClean = matchedData(req);
    const dbResponse = await editUserById(req.params.id, {...bodyClean, password });
    if (dbResponse instanceof Error) return next(dbResponse);
    dbResponse.affectedRows ? res.status(200).json({ message: "User modified!" }) : next();
};

const deleteOne = async(req, res, next) => {
    if (notNumber(+req.params.id, next)) return
    const dbResponse = await deleteUserById(+req.params.id);
    if (dbResponse instanceof Error) return next(dbResponse);
    dbResponse.affectedRows ? res.status(204).end() : next();
};
module.exports = { register, login, listAll, listOne, editOne, deleteOne };