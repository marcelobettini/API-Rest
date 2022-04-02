const jwt = require("jsonwebtoken")
const jwt_secret = process.env.jwt_secret
    //crea el token
    //recibe el objeto "usuario" (name, password, etc)
const tokenSign = async(user) => {
    const sign = jwt.sign({ name: user.name, email: user.email }, jwt_secret, { expiresIn: '1h' })
    return sign
}

//verifica que el token haya sido firmado por el backend
//recibe el token de sesión
const tokenVerify = async(tokenJWT) => {
    try {
        return jwt.verify(tokenJWT, jwt_secret)
    } catch (error) {
        return next(error) //en caso de una explosión...
    }

}

module.exports = { tokenSign, tokenVerify }