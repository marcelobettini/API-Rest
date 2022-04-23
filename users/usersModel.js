const pool = require("../db/config");

const registerNewUser = (user) => {
    const query = "INSERT INTO users SET ?";
    try {
        return pool.query(query, user);
    } catch (error) {
        error.message = error.code;
        return error;
    }
};

const loginUser = (email) => {
    const query = `SELECT * FROM users WHERE email = '${email}' LIMIT 1`;
    try {
        return pool.query(query);
    } catch (error) {
        error.message = error.code;
        return error;
    }
};
const getAllUsers = () => {
    const query = "SELECT * FROM users";
    try {
        return pool.query(query);
    } catch (error) {
        error.message = error.code;
        return error;
    }
};

const getUserById = (id) => {
    const query = `SELECT * FROM users WHERE id = ${id}`;
    try {
        return pool.query(query);
    } catch (error) {
        error.message = error.code;
        return error;
    }
};

const editUserById = (id, user) => {
    const query = `UPDATE users SET ? WHERE id = ${id}`;
    try {
        return pool.query(query, user);
    } catch (error) {
        error.message = error.code;
        return error;
    }
};

const deleteUserById = (id) => {
    const query = `DELETE FROM users WHERE id = ${id}`;
    try {
        return pool.query(query);
    } catch (error) {
        error.message = error.code;
        return error;
    }
};
module.exports = { registerNewUser, loginUser, getUserById, deleteUserById, editUserById, getAllUsers };