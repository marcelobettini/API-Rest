const { check, validationResult } = require("express-validator");

const validatorCreateUser = [
    check("name")
    .trim()
    .notEmpty().withMessage("Field cannot be empty")
    .isAlpha('es-ES', { ignore: ' ' }).withMessage("Only letters")
    .isLength({ min: 2, max: 90 }).withMessage("Character count: min 2, max 90"),
    check("email")
    .trim()
    .notEmpty().withMessage("Field cannot be empty")
    .isEmail().withMessage("Must be a valid email address")
    .normalizeEmail(),
    check("password")
    .trim()
    .notEmpty().withMessage("Field cannot be empty")
    .isLength({ min: 8, max: 15 }).withMessage("Character count: min 8, max 15"),
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