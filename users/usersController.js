const { getAllUsers, getUserById, addNewUser, editUserById, deleteUserById } = require("./usersModel")
const { matchedData } = require("express-validator")

const listAll = async(req, res, next) => {
    const dbResponse = await getAllUsers()
    if (dbResponse.hasOwnProperty("error")) return res.status(500).json(dbResponse)
    dbResponse.length ? res.status(200).json(dbResponse) : next()
};

const listOne = async(req, res, next) => {
    if (isNaN(+req.params.id)) {
        return res.status(400).json({ message: "ID must be a positive integer" })
    }
    const dbResponse = await getUserById(+req.params.id);
    if (dbResponse.hasOwnProperty("error")) return res.status(500).json(dbResponse)
    dbResponse.length ? res.status(200).json(dbResponse) : next()
};

const addOne = async(req, res) => {
    console.log(req.body) //show this...
    const bodyClean = matchedData(req) //....this
    console.log(bodyClean) //...and this
    const dbResponse = await addNewUser(bodyClean)
    dbResponse.hasOwnProperty("error") ? res.status(500).json(dbResponse) : res.status(201).json(bodyClean)
        /*dada la naturaleza de la respuesta (OKPacket) no obtendremos 404. Si "rompemos" la tabla dará error en el catch y si
        los datos son duplicados, también saldrá por el catch... dbResponse en este caso será un objeto en vez de array, existirá y tendrá length*/
}

const editOne = async(req, res, next) => {
    if (isNaN(+req.params.id)) {
        return res.status(400).json({ message: "ID must be a positive integer" })
    }
    const bodyClean = matchedData(req)
    const dbResponse = await editUserById(+req.params.id, bodyClean)
    if (dbResponse.hasOwnProperty("error")) return res.status(500).json(dbResponse)
    dbResponse.affectedRows ? res.status(200).json(bodyClean) : next()
}

const deleteOne = async(req, res, next) => {
    if (isNaN(+req.params.id)) {
        return res.status(400).json({ message: "ID must be a positive integer" })
    }
    const dbResponse = await deleteUserById(+req.params.id)
    if (dbResponse.hasOwnProperty("error")) return res.status(500).json(dbResponse)
    dbResponse.affectedRows ? res.status(204).end() : next()
}

module.exports = { listAll, listOne, addOne, editOne, deleteOne }