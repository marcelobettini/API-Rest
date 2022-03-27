const connection = require("../db/config")


const getAllPosts = async() => {
    const query = "SELECT * FROM posts"
    try {
        return await connection.query(query)
    } catch (error) {
        error.status = 500
        error.message = error.code
        return error
    }
}

const getPostsWith = async(string) => {
    const query = `SELECT * FROM posts WHERE title LIKE '%${string}%'`
    try {
        return await connection.query(query)
    } catch (error) {
        error.status = 500
        error.message = error.code
        return error
    }
}

const addNewPost = async(post) => {
    console.log(post)
}


module.exports = { getAllPosts, getPostsWith, addNewPost }