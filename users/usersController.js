const {
  getAllUsers,
  getUserById,
  deleteUserById,
  editUserById,
} = require("./usersModel");
const notNumber = require("../utils/notNumber");
const { hashPassword } = require("../utils/handlePassword");
const { matchedData } = require("express-validator");

const listAll = async (req, res, next) => {
  const dbResponse = await getAllUsers();
  if (dbResponse instanceof Error) return next(dbResponse);
  const filtered = dbResponse.map((e) => {
    const obj = {
      id: e.id,
      name: e.name,
      email: e.email,
      image: e.image,
    };
    return obj;
  });
  dbResponse.length ? res.status(200).json(filtered) : next();
};

const listOne = async (req, res, next) => {
  if (notNumber(+req.params.id, next)) return;
  const dbResponse = await getUserById(+req.params.id);
  if (dbResponse instanceof Error) return next(dbResponse);
  const { id, name, email, image } = dbResponse[0];
  const filtered = {
    id,
    name,
    email,
    image,
  };
  dbResponse.length ? res.status(200).json(filtered) : next();
};
const editOne = async (req, res, next) => {
  if (notNumber(+req.params.id, next)) return;
  const password = await hashPassword(req.body.password);
  const bodyClean = matchedData(req);
  const dbResponse = await editUserById(req.params.id, {
    ...bodyClean,
    password,
  });
  if (dbResponse instanceof Error) return next(dbResponse);
  dbResponse.affectedRows
    ? res.status(200).json({ message: "User modified!" })
    : next();
};

const deleteOne = async (req, res, next) => {
  if (notNumber(+req.params.id, next)) return;
  const dbResponse = await deleteUserById(+req.params.id);
  if (dbResponse instanceof Error) return next(dbResponse);
  dbResponse.affectedRows ? res.status(204).end() : next();
};
module.exports = { listAll, listOne, editOne, deleteOne };
