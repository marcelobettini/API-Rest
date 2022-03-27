const { getAllPosts, getPostsWith, addNewPost } = require("./postsModel")
const { matchedData } = require("express-validator")


// https://www.samanthaming.com/tidbits/94-how-to-check-if-object-is-empty/
const listAll = async(req, res, next) => {
    if (Object.keys(req.query).length > 0 && req.query.constructor === Object) {
        const dbResponse = await getPostsWith(req.query.title)
        if (dbResponse instanceof Error) return next(dbResponse)
        dbResponse.length ? res.status(200).json(dbResponse).end() : next()
    } else {
        const dbResponse = await getAllPosts()
        if (dbResponse instanceof Error) return next(dbResponse)
        dbResponse.length ? res.status(200).json(dbResponse) : next()
    }

};

const addOne = async(req, res, next) => {
    const bodyClean = matchedData(req)
    const dbResponse = await addNewPost(bodyClean)

    // dbResponse instanceof Error ? next(dbResponse) : res.status(201).json(bodyClean)
    /*dada la naturaleza de la respuesta (OKPacket) no obtendremos 404. Si "rompemos" la tabla dará error en el catch y si
    los datos son duplicados, también saldrá por el catch... dbResponse en este caso será un objeto en vez de array, existirá y tendrá length*/
}

module.exports = { listAll, addOne }