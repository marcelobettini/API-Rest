const multer = require("multer")
const storage = multer.diskStorage({
    destination: (req, file, callback) => {

        const pathStorage = `${__dirname}/../storage` /*__dirname is an environment variable that tells you the absolute path of the directory containing the currently executing file.*/

        callback(null, pathStorage) //paso null porque no tengo error para manejar
    },
    /*aquí vamos a implementar un método para que, si se suben archivos con el mismo nombre, no se sobreescriban. 
    La estrategia consiste en tomar la extensión del archivo y reemplazar el nombre por uno aleatorio, basado en el timestamp*/
    filename: (req, file, callback) => {
        /*aquí obtenemos la extensión del archivo del originalname. Una vez que lo obtengamos, separamos por el punto con split.
        Si el nombre contuviera más de un punto, igualmente podríamos acceder a la extensión porque sería la última entrada (index) del array resultante. pop()  **
        REMEMBER: The split() method divides a String into an ordered list of substrings, puts these substrings into an array, and returns the array. The division is done by searching for a pattern; where the pattern is provided as the first parameter in the method's call.
        */
        const ext = file.originalname.split(".").pop() //**
        const filename = `file_${Date.now()}.${ext}`;
        callback(null, filename)
    }
});

//creamos el middleware 
const uploadFile = multer({ storage: storage })

module.exports = uploadFile