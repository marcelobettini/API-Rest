const { getAllUsers, getUserById, registerNewUser, deleteUserById, editUserById, loginUser, changePasswordById } = require("./usersModel")
const notNumber = require("../utils/notNumber")
const { hashPassword, checkPassword } = require("../utils/handlePassword")
const { tokenSign, tokenVerify } = require("../utils/handleJWT")
const public_url = process.env.public_url
const fileUpload = require("../utils/handleStorage")
const { matchedData } = require("express-validator")

//REGISTER
const register = async(req, res, next) => {
    const urlFile = `${public_url}/${req.file.filename}`
    const password = await hashPassword(req.body.password);

    const bodyClean = matchedData(req); //....this

    const dbResponse = await registerNewUser({...bodyClean, image: urlFile, password });
    if (dbResponse instanceof Error) return next(dbResponse);
    const user = {
        name: bodyClean.name,
        email: bodyClean.email
    }
    const tokenData = {
        token: await tokenSign(user, "24h"),
        user
    }
    res.status(201).json({ message: "User created!", JWT_Info: tokenData });
};

//LOGIN
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
            token: await tokenSign(user, "24h"),
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

/*-------------------------------------------------*/
const nodemailer = require("nodemailer")
let mailTransporter = nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    auth: {
        user: "6e484dacca656f",
        pass: "1f6bdc0eb465f2"
    }
});

//FORGOT
const forgot = async(req, res, next) => {
    const dbResponse = await loginUser(req.body.email)
    if (!dbResponse.length) return next();
    const user = {
        id: dbResponse[0].id,
        name: dbResponse[0].name,
        email: dbResponse[0].email
    }
    const token = await tokenSign(user, "1m")

    const link = `${process.env.public_url}/users/reset/${token}`

    let mailDetails = {
        from: "Tech-Support@mydomain.com",
        to: user.email,
        subject: 'Password recovery magic-link',
        html: `<h2>Password Recovery Service</h2>
        <p>To reset your password, please click on the magic link and follow instructions</p>
        <a href="${link}">click</a>
        `
    }
    mailTransporter.sendMail(mailDetails, (err, data) => {
        if (err) {
            res.sendStatus(500)
        } else {
            res.status(200).json({ message: `Hi ${user.name}, we've sent an email with instructions to ${user.email}` })
        }
    })
}

//FORM ->  RESET PASSWORD
const reset = async(req, res, next) => {
    const { token } = req.params
    const tokenStatus = await tokenVerify(token)
    if (tokenStatus instanceof Error) {
        res.send(tokenStatus)
    } else {
        res.render("reset", { tokenStatus, token })
    }
}

const saveNewPass = async(req, res, next) => {
    const { token } = req.params
    const tokenStatus = await tokenVerify(token)
    if (tokenStatus instanceof Error) return res.send(tokenStatus);
    const newPassword = await hashPassword(req.body.password_1)
    dbResponse = await changePasswordById(tokenStatus.id, newPassword)
    dbResponse instanceof Error ? next(dbResponse) : res.status(200).json({ message: `Password changed for user ${tokenStatus.name}` })
}

const listAll = async(req, res, next) => {
    const dbResponse = await getAllUsers();
    if (dbResponse instanceof Error) return next(dbResponse);
    const filtered = dbResponse.map(e => {
        const obj = {
            id: e.id,
            name: e.name,
            email: e.email,
            password: e.password
        }
        return obj
    })
    dbResponse.length ? res.status(200).json(filtered) : next();
};

const listOne = async(req, res, next) => {
    if (notNumber(+req.params.id, next)) return
    const dbResponse = await getUserById(+req.params.id);
    if (dbResponse instanceof Error) return next(dbResponse);
    const { id, name, email, image } = dbResponse[0]
    const filtered = {
        id,
        name,
        email,
        image
    }
    dbResponse.length ? res.status(200).json(filtered) : next();
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
module.exports = { register, login, forgot, reset, saveNewPass, listAll, listOne, editOne, deleteOne };