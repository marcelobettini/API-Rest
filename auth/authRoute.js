const router = require('express').Router()
const uploadFile = require("../utils/handleStorage");
const { validatorCreateUser, validatorResetPassword } = require("../validators/users");
const { register, login, forgot, reset, saveNewPass } = require("./authController")

//register new users
router.post("/register", uploadFile.single("file"), validatorCreateUser, register)
//login
router.post("/login", login)

//TODO:
//refresh token
router.post("/refresh")

//Forgot password
router.post("/forgot-password", forgot)
//Get Magic Link
router.get("/reset/:token", reset);
router.post("/reset/:token", validatorResetPassword, saveNewPass)
module.exports = router



