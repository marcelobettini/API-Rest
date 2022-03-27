const pool = require("../db/config")


const getAllPosts = async() => {
    const query = "SELECT * FROM posts"
    try {
        return await pool.query(query)
    } catch (error) {
        error.status = 500
        error.message = error.code
        return error
    }
}

const getPostsWith = async(string) => {
    const query = `SELECT * FROM posts WHERE title LIKE '%${string}%'`
    try {
        return await pool.query(query)
    } catch (error) {
        error.status = 500
        error.message = error.code
        return error
    }
}

const addNewPost = async(post) => {
    const query = "INSERT INTO posts SET ?";
    try {
        return await pool.query(query, post)
    } catch (error) {
        error.status = 500
        error.message = error.code
        return error
    }
}


module.exports = { getAllPosts, getPostsWith, addNewPost }