const mysql = require("mysql");

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
const connection = mysql.createConnection({
  host: "localhost",
  database: "api",
  user: "root",
  password: "",
});

module.exports = connection;
