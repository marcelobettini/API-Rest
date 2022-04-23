const { getAllPosts, getPostsWith, addNewPost } = require("./postsModel")
const { matchedData } = require("express-validator");

// https://www.samanthaming.com/tidbits/94-how-to-check-if-object-is-empty/
//if (Object.keys(req.query).length === 0 && req.query.constructor === Object)
const listAll = async (req, res, next) => {
    let dbResponse = null
    if (req.query.title) {
        dbResponse = await getPostsWith(req.query.title)
    } else {
        dbResponse = await getAllPosts()
    }
    if (dbResponse instanceof Error) return next(dbResponse)
    dbResponse.length ? res.status(200).json(dbResponse) : next()
}

const addOne = async (req, res, next) => {
    const cleanBody = matchedData(req)
    const dbResponse = await addNewPost({
        userid: req.token.id,
        ...cleanBody
    })
    dbResponse instanceof Error ? next(dbResponse) : res.status(201).json({ message: `Post created! by ${req.token.name}` })
}


module.exports = { listAll, addOne }