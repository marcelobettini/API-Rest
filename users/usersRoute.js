const router = require("express").Router();
const { register, login, listOne, listAll, editOne, deleteOne } = require("./usersController");
const uploadFile = require("../utils/handleStorage");
const { validatorCreateUser } = require("../validators/users");

//create new users
router.post("/register", uploadFile.single("file"), validatorCreateUser, register);

//login
router.post("/login", login)

module.exports = router


// get all users
router.get("/", listAll)

// get user by id
router.get("/:id", listOne);

// patch user by id
router.patch("/:id", uploadFile.single("file"), validatorCreateUser, editOne)

// delete user by id
router.delete("/:id", deleteOne);