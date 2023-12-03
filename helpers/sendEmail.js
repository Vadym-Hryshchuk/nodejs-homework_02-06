require("dotenv").config(); // Це поки що!!!!
const nodemailer = require("nodemailer");

const { USER_NAME, USER_PASS } = process.env;

const transport = nodemailer.createTransport({
  host: "smtp.ukr.net",
  port: 2525,
  secure: true,
  auth: {
    user: USER_NAME,
    pass: USER_PASS,
  },
});

const sendEmail = (message) => {
  message.from = USER_NAME;

  return transport.sendMail(message);
};

module.exports = sendEmail;
