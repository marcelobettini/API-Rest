// CORS: https://developer.mozilla.org/es/docs/Web/HTTP/CORS
//npm i cors (dependencia de producción, no Dev, ojo)
const express = require("express")
const hbs = require("express-handlebars")
const path = require("path")
require("dotenv").config()
require("./db/config");
const cookieParser = require("cookie-parser")

const cors = require("cors");

const PORT = process.env.PORT || 3000;

const server = express();
server.use('/css', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/css')))
server.use('/js', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/js')))
server.use(express.static("storage"))
server.use(cors());
server.use(express.json());
server.use(express.urlencoded({ extended: true }));
server.use(cookieParser())

//Handlebars
server.set("view engine", "hbs");
server.set("views", "./views"); //path.join(__dirname, "views")
server.engine("hbs", hbs.engine({ extname: "hbs" }))

//Routing...
//Welcome
server.get("/", (req, res) => {
    res.send("Welcome...")
})
//Auth
server.use("/auth", require("./usersAuth/usersAuthRoute"))
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