const {
    getAllUsers,
    getUserById,
    addNewUser,
    editUserById,
    deleteUserById,
    loginUser,
} = require("./usersModel");
const notNumber = require("../utils/notNumber")
const { hashPassword, checkPassword } = require("../utils/handlePassword");
const { matchedData } = require("express-validator");
const jwt = require("jsonwebtoken");
const private_key = process.env.private_key

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

const addOne = async(req, res, next) => {
    const password = await hashPassword(req.body.password);

    console.log(req.body); //show this...
    const bodyClean = matchedData(req); //....this
    console.log(bodyClean); //...and this

    const dbResponse = await addNewUser({...bodyClean, password });
    dbResponse instanceof Error
        ?
        next(dbResponse) :
        res.status(201).json({ message: "User created!" });
    /*dada la naturaleza de la respuesta (OKPacket) no obtendremos 404. Si "rompemos" la tabla dará error en el catch y si los datos son duplicados, también saldrá por el catch... dbResponse en este caso será un objeto en vez de array, existirá y tendrá length*/
};

const editOne = async(req, res, next) => {
    if (notNumber(+req.params.id, next)) return
    const bodyClean = matchedData(req);
    const dbResponse = await editUserById(+req.params.id, bodyClean);
    if (dbResponse instanceof Error) return next(dbResponse);
    dbResponse.affectedRows ? res.status(200).json(bodyClean) : next();
};

const deleteOne = async(req, res, next) => {
    if (notNumber(+req.params.id, next)) return
    const dbResponse = await deleteUserById(+req.params.id);
    if (dbResponse instanceof Error) return next(dbResponse);
    dbResponse.affectedRows ? res.status(204).end() : next();
};

const loginOne = async(req, res, next) => {
    const password = await hashPassword(req.body.password);
    const dbResponse = await loginUser(req.body.email);
    if (!dbResponse.length) return next();
    if (await checkPassword(req.body.password, dbResponse[0].password)) {
        const user = Object.values(JSON.parse(JSON.stringify(dbResponse)));
        jwt.sign({ user }, private_key, { expiresIn: "1h" }, (err, token) => {
            res.json({ token: token });
        });
    } else {
        const error = {
            status: 401,
            message: "Unauthorized",
        };
        next(error);
    }
};
module.exports = { listAll, listOne, addOne, editOne, deleteOne, loginOne };