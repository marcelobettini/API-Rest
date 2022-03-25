// CORS: https://developer.mozilla.org/es/docs/Web/HTTP/CORS
//npm i cors (dependencia de producción, no Dev, ojo)
const express = require("express")
require("dotenv").config()
require("./db/config");
// const { body, validationResult } = require("express-validator");
const { validatePost } = require("./validators/users")

const cors = require("cors");
// const validatePatch = [
//     body("name", "Name min length is 2 characters")
//     .optional()
//     .isLength({ min: 2 }),
//     body("username", "User name min length is 2 characters")
//     .optional()
//     .isLength({ min: 2 }),
//     body("email", "Must be a valid email").optional().isEmail(),
// ];
// const validate = [
//     body("name")
//     .exists()
//     .withMessage("Must provide a name")
//     .isLength({ min: 2 })
//     .withMessage("Name min length is 2 characters"),
//     body("username").exists().withMessage("Must provide a user name"),
//     body("email")
//     .exists()
//     .withMessage("Email is required")
//     .isEmail()
//     .withMessage("Must be a valid email"),
// ];

const PORT = process.env.PORT || 3000;
const { matchedData } = require("express-validator");

const server = express();
server.use(cors());
server.use(express.json());
server.use(express.urlencoded({ extended: true }));

//Users Routing
server.use("/users", require("./users/usersRoute"))




//Catch all
server.use((req, res, next) => {
    let err = new Error("Resource not found");
    err.status = 404;
    next(err);
});

//Error handler
server.use((error, req, res, next) => {
    res.status(error.status || 500)
    res.json({ status: error.status, message: error.message });
});

//Launch local server
server.listen(PORT, (err) => {
    err
        ?
        console.warn("Falla de inicio", { Error: err }) :
        console.log(`Server running on port ${PORT}`);
});