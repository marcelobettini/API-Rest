const { check, validationResult } = require("express-validator");

const validatorCreateUser = [
    check("name").trim()
    .exists().withMessage("Name field is required")
    .notEmpty().withMessage("Must not be empty")
    .isLength({ min: 2, max: 30 }).withMessage("Character count: 2 min, 30 max"),
    check("email")
    .exists()
    .notEmpty()
    .isEmail(),
    check("password").trim()
    .exists()
    .notEmpty()
    .isLength({ min: 6, max: 30 }),
    (req, res, next) => {
        try {
            validationResult(req).throw()
            return next() //si pasa validaciones, sigue hacia el controlador
        } catch (err) {
            res.status(400).send({ errors: err.array() })
        }
    }
]
module.exports = { validatorCreateUser }