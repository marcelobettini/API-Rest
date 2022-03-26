const router = require("express").Router()
    // const { validatorCreateUser } = require("../validators/users")

const { listAll } = require("./postsController")
router.get("/", listAll)

module.exports = router