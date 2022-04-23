const router = require("express").Router();
const { listOne, listAll, editOne, deleteOne } = require("./usersController");
const uploadFile = require("../utils/handleStorage");
const { validatorModifyUser } = require("../validators/users");

// get all users
router.get("/", listAll)

// get user by id
router.get("/:id", listOne);

// patch user by id
router.patch("/:id", uploadFile.single("file"), validatorModifyUser, editOne)

// delete user by id
router.delete("/:id", deleteOne);
module.exports = router