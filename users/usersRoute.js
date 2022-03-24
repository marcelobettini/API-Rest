const router = require("express").Router()
const { validatorCreateUser } = require("../validators/users")

const { listAll, listOne, addOne, editOne, deleteOne } = require("./usersController")
router.get("/", listAll)
router.get("/:id", listOne)
router.post("/", validatorCreateUser, addOne)
router.patch("/:id", validatorCreateUser, editOne)
router.delete("/:id", deleteOne)

module.exports = router