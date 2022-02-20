const { urlencoded } = require("express");
const express = require("express");
const connection = require("./db");
const { body, validationResult } = require("express-validator");
const validatePatch = [
  body("name", "Name min length is 2 characters")
    .optional()
    .isLength({ min: 2 }),
  body("userName", "User name min length is 2 characters")
    .optional()
    .isLength({ min: 2 }),
  body("email", "Must be a valid email").optional().isEmail(),
];
const validate = [
  body("name")
    .exists()
    .withMessage("Must provide a name")
    .isLength({ min: 2 })
    .withMessage("Name min length is 2 characters"),
  body("userName").exists().withMessage("Must provide a user name"),
  body("email")
    .exists()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Must be a valid email"),
];

const PORT = process.env.PORT || 3000;
//check connection
connection.connect((err) => {
  err
    ? console.log(`Err code: ${err.errno} | Err Type: ${err.message}`)
    : console.log("Connection established...");
});

const server = express();
server.use(express.json());
server.use(urlencoded({ extended: true }));

//GET all users
server.get("/user", (req, res) => {
  const query = "SELECT * FROM users";
  connection.query(query, (err, data) => {
    if (err) {
      throw err;
    }
    if (data.length) {
      res.status(200).json(data);
    } else {
      res.status(404).send("Nothing here 😞");
    }
  });
});

//GET user by id
server.get("/user/:id", (req, res, next) => {
  let { id } = req.params;
  id = Number(id);
  if (!isNaN(id)) {
    const query = `SELECT * FROM users WHERE id = ${id}`;
    connection.query(query, (err, data) => {
      if (err) throw err;

      if (data.length) {
        res.json(data); //devuelve res.status(200)
      } else {
        res.status(404).send(`No user with id ${id}`); //devuelve res.status(404)
      }
    });
  } else {
    next();
  }
});

//POST new user (create)
server.post("/user", validate, (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).send({ errors: errors.array() });
  } else {
    const { name, userName, email } = req.body;
    const newRecord = {
      name,
      userName,
      email,
    };
    const query = "INSERT INTO users SET ?";
    connection.query(query, newRecord, (err) => {
      if (err) throw err;
      res.status(201).send("User created!");
    });
  }
});

//PATCH new data on existing user (edit)
server.patch("/user/:id", validatePatch, (req, res) => {
  const errors = validationResult(req);
  // if (req.body.constructor === Object && Object.keys(req.body).length === 0)
  //if no keys, returns empty arr
  if (!Object.keys(req.body).length) {
    res.status(400).send("No incluyó ningún campo para modificar");
  } else if (!errors.isEmpty()) {
    res.status(400).send({ errors: errors.array() });
  } else {
    const { id } = req.params;
    const query = `UPDATE users SET ? WHERE id = ${id}`;
    console.log(req.body);
    connection.query(query, req.body, (err) => {
      if (err) throw err;
      res.status(200).send("User changed!");
    });
  }
});

//DELETE user by id
server.delete("/user/:id", (req, res) => {
  const { id } = req.params;
  const query = `DELETE FROM users WHERE id = ${id}`;
  connection.query(query, (err, rows) => {
    if (err) throw err;
    if (rows.affectedRows === 0) {
      res.status(404).send(`No user with id ${id}`);
    } else {
      res.status(200).send("User deleted!"); //code 204 also would be fine
    }
  });
});

//404
server.use((req, res) => {
  res.status(404).send("Resource Not Found");
});

//Launch local server
server.listen(PORT, (err) => {
  err
    ? console.log("Ocurrió un error, we are Kaput")
    : console.log(`Server running on port ${PORT}`);
});
