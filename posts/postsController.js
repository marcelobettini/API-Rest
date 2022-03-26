const { getAllPosts } = require("./postsModel")
    // const { matchedData } = require("express-validator")

const listAll = async(req, res, next) => {
    const dbResponse = await getAllPosts()
    if (dbResponse instanceof Error) return next(dbResponse)
    dbResponse.length ? res.status(200).json(dbResponse) : next()
};

module.exports = { listAll }