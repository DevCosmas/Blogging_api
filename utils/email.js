const nodemailer = require("nodemailer");
const appError = require('./../utils/errorhandler');

const sendEmail = async (message, user) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USERNAME,
      to: user.email,
      subject: "Welcome to the blog",
      text: message,
    };


    const info = await transporter.sendMail(mailOptions);
    return info;
  } catch (error) {

    const emailError = new appError('Email could not be sent', 500);
    console.error('Email error:', error);
    throw emailError;
  }
};

module.exports = sendEmail;
