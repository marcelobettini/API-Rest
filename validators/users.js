const { check, validationResult } = require("express-validator");

const validatorCreateUser = [
    check("name")
    .exists().withMessage("Name field required")
    .trim()
    .isAlpha('es-ES', { ignore: ' ' }).withMessage("Only letters")
    .isLength({ min: 2, max: 90 }).withMessage("Character count: min 2, max 90"),
    check("email")
    .exists().withMessage("Email field required")
    .trim()
    .isEmail().withMessage("Must be a valid email address")
    .normalizeEmail(),
    check("password")
    .exists()
    .trim()
    .isLength({ min: 8, max: 15 }),
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