const router = require("express").Router();
const { register, login, forgot, reset, saveNewPass, listOne, listAll, editOne, deleteOne } = require("./usersController");
const uploadFile = require("../utils/handleStorage");
const { validatorCreateUser, validatorModifyUser, validatorResetPassword } = require("../validators/users");

//create new users
router.post("/register", uploadFile.single("file"), validatorCreateUser, register);
//login
router.post("/login", login)
    //Forgot password
router.post("/forgot-password", forgot)
    //Get Magic Link
router.get("/reset/:token", reset);
router.post("/reset/:token", validatorResetPassword, saveNewPass)
    // get all users
router.get("/", listAll)

// get user by id
router.get("/:id", listOne);

// patch user by id
router.patch("/:id", uploadFile.single("file"), validatorModifyUser, editOne)

// delete user by id
router.delete("/:id", deleteOne);
module.exports = router