//creamos el middleware para verificar el token del usuario antes de garantizarle acceso a ruta posts
/*Whenever the user wants to access a protected route or resource, the user agent should send the JWT, typically in the Authorization header using the Bearer schema. The content of the header should look like the following:*/
//Authorization: Bearer < token >

function verifyToken(req, res, next) {
    const bearerHeader = req.headers['authorization']
    console.log("Bearer Header en verifyToken:", bearerHeader)
    if (typeof bearerHeader !== 'undefined') {
        req.token = bearerHeader
        console.log("valor de req.token en verifyToken", req.token)
        next() //pasamos al controlador (o al siguiente middleware)
    } else { //si bearerHeader es undefined significa que no tengo tokenç
        res.status(403).json({ message: "Forbidden access | No Valid Token" })
    }
}

module.exports = { verifyToken }