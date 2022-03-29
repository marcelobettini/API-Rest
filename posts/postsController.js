const { getAllPosts, getPostsWith, addNewPost } = require("./postsModel")
const { matchedData } = require("express-validator")
const jwt = require("jsonwebtoken")
const jwt_token = process.env.private_key


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
    jwt.verify(req.token, jwt_token, async(error, authData) => {
        if (error) {
            res.status(400).json({ message: "Forbidden access | No Valid Token" })
        } else {
            const dbResponse = await addNewPost({
                userid: authData.user[0].id,
                ...bodyClean
            })
            dbResponse instanceof Error ? next(dbResponse) : res.status(201).json({ message: "Post created!", authData })

        }
    })

}

module.exports = { listAll, addOne }