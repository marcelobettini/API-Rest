const mysql = require("mysql");
const util = require("util");
//MacBook
/* MAMP config for MacBookPro M1 */
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASS_MAC,
  socketPath: process.env.DB_SOCKET,
  port: process.env.DB_PORT,
});

//check connection
pool.getConnection((err, connection) => {
  if (err) {
    console.warn("No conectado", { error: err.message });
  } else {
    console.log("Connection to DB Ok!");
    connection.release();
    return;
  }
});

// const connection = mysql.createConnection({
// host: process.env.db_host,
// database: process.env.db_name,
// user: process.env.db_user,
// pass: process.env.db_pass
// });
// connection.connect((err) => {
//   err
//     ? console.warn("No conectado", { error: err.message })
//     : console.log("Conexión establecida...");
// });
pool.query = util.promisify(pool.query);

module.exports = pool;
