const mysql = require("mysql");
const util = require("util");
//MacBook
/* MAMP config for MacBookPro M1 */
// const pool = mysql.createPool({
//   host: process.env.DB_HOST,
//   database: process.env.DB_NAME,
//   user: process.env.DB_USER,
//   password: process.env.DB_PASS_MAC,
//   socketPath: process.env.DB_SOCKET,
//   port: process.env.DB_PORT,
// });

const pool = mysql.createPool({
    user: process.env.db_user,
    host: process.env.db_host,
    database: process.env.db_name,
    password: process.env.db_pass
});

// check connection
pool.getConnection((err, conn) => {
    if (err) {
        console.warn("No conectado", { error: err.message });
    } else {
        console.log("Connection to DB Ok!");
        pool.releaseConnection(conn)
    }
});

pool.query = util.promisify(pool.query);

module.exports = pool;