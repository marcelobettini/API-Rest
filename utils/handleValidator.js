const { validationResult } = require("express-validator")

const validateResults = (req, res, next) => {
    try {
        validationResult(req).throw()
        return next() //si pasa validaciones, sigue hacia el controlador
    } catch (err) {
        res.status(400).json({ errors: err.array() })
    }
}
module.exports = validateResults