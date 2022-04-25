const {
  registerNewUser,
  editUserById,
  loginUser,
} = require("../users/usersModel");
const { hashPassword, checkPassword } = require("../utils/handlePassword");
const { tokenSign, tokenVerify } = require("../utils/handleJWT");
const public_url = process.env.public_url;
const { matchedData } = require("express-validator");

//REGISTER
const register = async (req, res, next) => {
  const urlFile = `${public_url}/${req.file.filename}`;
  const password = hashPassword(req.body.password);

  const bodyClean = matchedData(req); //....this

  const dbResponse = await registerNewUser({
    ...bodyClean,
    image: urlFile,
    password,
  });
  if (dbResponse instanceof Error) return next(dbResponse);
  const user = {
    name: bodyClean.name,
    email: bodyClean.email,
  };
  const token = await tokenSign(user, "30m");
  const refresh = await tokenSign(user, "1y");
  res
    .status(201)
    .json({
      message: "User created!",
      Refresh_Token: refresh,
      Access_Token: token,
    });
};

//LOGIN
const login = async (req, res, next) => {
  const dbResponse = await loginUser(req.body.email);
  if (!dbResponse.length) return next();
  if (await checkPassword(req.body.password, dbResponse[0].password)) {
    const user = {
      id: dbResponse[0].id,
      name: dbResponse[0].name,
      email: dbResponse[0].email,
      image: dbResponse[0].image,
    };
    const token = await tokenSign(user, "30m");
    const refresh = await tokenSign(user, "1y");
    res
      .status(201)
      .json({
        message: "User created!",
        Refresh_Token: refresh,
        Access_Token: token,
      });
  } else {
    const error = {
      status: 401,
      message: "Unauthorized",
    };
    next(error);
  }
};

/*-------------------------------------------------*/
const nodemailer = require("nodemailer");
let mailTransporter = nodemailer.createTransport({
  host: "smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: process.env.mail_user,
    pass: process.env.mail_pass,
  },
});

//FORGOT
const forgot = async (req, res, next) => {
  const dbResponse = await loginUser(req.body.email);
  if (!dbResponse.length) return next();
  const user = {
    id: dbResponse[0].id,
    name: dbResponse[0].name,
    email: dbResponse[0].email,
  };
  const token = await tokenSign(user, "15m");

  const link = `${process.env.public_url}/users/reset/${token}`;

  const mailDetails = {
    from: "Tech-Support@mydomain.com",
    to: user.email,
    subject: "Password recovery magic-link",
    html: `<h2>Password Recovery Service</h2>
        <p>To reset your password, please click on the link and follow instructions</p>
        <a href="${link}">click</a>
        `,
  };
  mailTransporter.sendMail(mailDetails, (error, data) => {
    if (error) {
      error.message = error.code;
      next(error);
    } else {
      res
        .status(200)
        .json({
          message: `Hi ${user.name}, we've sent an email with instructions to ${user.email}`,
        });
    }
  });
};

//FORM ->  RESET PASSWORD
const reset = async (req, res, next) => {
  const { token } = req.params;
  const tokenStatus = await tokenVerify(token);
  if (tokenStatus instanceof Error) return next(tokenStatus);
  res.render("reset", { tokenStatus, token });
};
//Saves the new password
//podemos reutilizar editUserById
const saveNewPass = async (req, res, next) => {
  const { token } = req.params;
  const tokenStatus = await tokenVerify(token);
  if (tokenStatus instanceof Error) return next(tokenStatus);
  const newPassword = await hashPassword(req.body.password_1);
  dbResponse = await editUserById(tokenStatus.id, { password: newPassword });
  dbResponse instanceof Error
    ? next(dbResponse)
    : res
        .status(200)
        .json({ message: `Password changed for user ${tokenStatus.name}` });
};

module.exports = { register, login, forgot, reset, saveNewPass };
