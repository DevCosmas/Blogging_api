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

    // Send the email and wait for the result using await
    const info = await transporter.sendMail(mailOptions);

    console.log('Email sent successfully:', info);

    return info;
  } catch (error) {
    // Create an instance of appError with an error message
    const emailError = new appError('Email could not be sent', 500);

    // Log the error and throw it to handle it at a higher level
    console.error('Email error:', error);
    throw emailError;
  }
};

module.exports = sendEmail;
