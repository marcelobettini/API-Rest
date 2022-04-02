const router = require("express").Router();
const { listAll, listOne, deleteOne, editOne, register, login } = require("./usersController");
const uploadFile = require("../utils/handleStorage");
const { validatorCreateUser } = require("../validators/users");

//get all users
router.get("/", listAll)

//get user by id
router.get("/:id", listOne);

//create new users
router.post("/register", uploadFile.single("file"), validatorCreateUser, register);

//login
router.post("/login", login)

//patch user by id
router.patch("/:id", validatorCreateUser, editOne)

//delete user by id
router.delete("/:id", deleteOne);

module.exports = router