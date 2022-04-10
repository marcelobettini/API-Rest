const jwt = require("jsonwebtoken")
const jwt_secret = process.env.jwt_secret
    //crea el token
    //recibe el objeto "usuario" (name, password, etc)
const tokenSign = async(user, time) => {
    console.log(user)
    const sign = jwt.sign({ id: user.id, name: user.name, email: user.email, image: user.image }, jwt_secret, { expiresIn: time })
    return sign
}

//verifica que el token haya sido firmado por el backend
//recibe el token de sesión
const tokenVerify = async(tokenJWT) => {
    try {
        return jwt.verify(tokenJWT, jwt_secret)
    } catch (error) {
        return error
    }
}
module.exports = { tokenSign, tokenVerify }