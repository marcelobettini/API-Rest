const { check } = require("express-validator");
const validateResults = require("../utils/handleValidator")

const validatorCreateUser = [
    check("name")
    .exists()
    .notEmpty()
    .isLength({ min: 2, max: 30 }),
    check("username")
    .exists()
    .notEmpty()
    .isLength({ min: 3, max: 15 }),
    check("email")
    .exists()
    .notEmpty()
    .isEmail(),
    (req, res, next) => {
        return validateResults(req, res, next) //en utils/handleValidator... could be here, though
    }
]

module.exports = { validatorCreateUser }