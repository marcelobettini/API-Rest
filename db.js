const mysql = require("mysql");
const dotenv = require("dotenv");
dotenv.config();

//MacBook
// const connection = mysql.createConnection({
//   host: "localhost",
//   port: 8889,
//   database: "api",
//   user: "root",
//   password: "root",
//   socketPath: "/Applications/MAMP/tmp/mysql/mysql.sock",
// });

//Windows PC
console.log(process.env.DB_HOST);
const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
});
module.exports = connection;
