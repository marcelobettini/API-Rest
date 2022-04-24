const jwt = require("jsonwebtoken")
const jwt_secret = process.env.jwt_secret
//crea el token
//recibe el objeto "usuario" (name, password, etc)
const tokenSign = async (user, time) => {

    const sign = jwt.sign(user, jwt_secret, { expiresIn: time })
    return sign
}

//verifica que el token haya sido firmado por el backend
//recibe el token de sesión
const tokenVerify = async (tokenJWT) => {
    try {
        return jwt.verify(tokenJWT, jwt_secret)
    } catch (error) {
        return error
    }
}
module.exports = { tokenSign, tokenVerify }

// Below are the steps to do revoke your JWT access token:

// When you do log in, send 2 tokens(Access token, Refresh token) in response to the client.
// The access token will have less expiry time and Refresh will have long expiry time.

// The client(Front end) will store refresh token in his local storage and access token in cookies.
// The client will use an access token for calling APIs.But when it expires, you call auth server API to get the new token(refresh token is automatically added to http request since it's stored in cookies).
// Your auth server will have an API exposed which will accept refresh token and checks for its validity and return a new access token.
// Once the refresh token is expired, the User will be logged out.