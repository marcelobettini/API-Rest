const notNumber = (id, next) => {
    if (isNaN(id)) {
        let error = new Error("ID must be a positive integer")
        error.status = 400
        next(error)
        return true
    } else {
        return false
    }
}
module.exports = notNumber