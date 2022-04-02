// CORS: https://developer.mozilla.org/es/docs/Web/HTTP/CORS
//npm i cors (dependencia de producción, no Dev, ojo)
const express = require("express")
require("dotenv").config()
require("./db/config");
const { validatePost } = require("./validators/users")

const cors = require("cors");
const PORT = process.env.PORT || 3000;

const server = express();
server.use(cors());
server.use(express.json());
server.use(express.urlencoded({ extended: true }));
server.use(express.static("storage"))

//Routing...
//Users 
server.use("/users", require("./users/usersRoute"))

//Posts
server.use("/posts", require("./posts/postsRoute"))




//404
server.use((req, res, next) => {
    let error = new Error("Resource not found");
    error.status = 404
    next(error)

})

//Error handler
server.use((error, req, res, next) => {
    if (!error.status) {
        error.status = 500
    }
    res.status(error.status).json({ status: error.status, message: error.message })
})

//Launch local server
server.listen(PORT, (err) => {
    err
        ?
        console.warn("Falla de inicio", { Error: err }) :
        console.log(`Server running on port ${PORT}`);
});