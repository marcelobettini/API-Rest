const mysql = require("mysql");
const connection = mysql.createConnection({
  host: "localhost",
  port: 8889,
  database: "api",
  user: "root",
  password: "root",
  socketPath: "/Applications/MAMP/tmp/mysql/mysql.sock",
});

module.exports = connection;
