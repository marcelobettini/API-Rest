const { check, validationResult } = require("express-validator");

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
        try {
            validationResult(req).throw()
            return next() //si pasa validaciones, sigue hacia el controlador
        } catch (err) {
            res.status(400).send({ errors: err.array() })
        }
    }
]
module.exports = { validatorCreateUser }