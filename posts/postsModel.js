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


module.exports = { getAllPosts }