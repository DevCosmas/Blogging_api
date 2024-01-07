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



// const nodemailer = require('nodemailer');
// const ejs = require('ejs');
// const path = require('path');
// const { appError } = require('./appError');

// class EmailSender {
//   constructor() {
//     this.transporter = nodemailer.createTransport({
//       service: 'Gmail',
//       auth: {
//         user: process.env.EMAIL_USERNAME,
//         pass: process.env.EMAIL_PASSWORD,
//       },
//     });
//   }

//   async sendEmail(toAddress, subject, text, html) {
//     try {
//       const mailOptions = {
//         from: process.env.EMAIL_USERNAME,
//         to: toAddress,
//         subject: subject,
//         text: text,
//         html: html,
//       };

//       await this.transporter.sendMail(mailOptions);
//       console.log('Email sent to:', toAddress);
//     } catch (error) {
//       throw new appError(error, 500);
//     }
//   }

//   async sendGeneralEmail(users, message, heading) {
//     try {
//       for (const user of users) {
//         try {
//           const toAddress = user.email;
//           const firstname = user.firstname;

//           console.log(toAddress)

//           if (!toAddress) {
//             console.error('Invalid user email:', user);
//             continue;
//           }

//           const templatePath = path.join(__dirname, '../views/email.ejs');
//           const template = await ejs.renderFile(templatePath, {
//             message,
//             firstname,
//             heading,
//           });

//           await this.sendEmail(toAddress, heading, message, template);
//         } catch (error) {
//           throw new appError(error, 500);
//         }
//       }

//       return 'All emails sent successfully';
//     } catch (error) {
//       throw new appError(error, 500);
//     }
//   }

//   async sendWelcomeEmail(user, url) {
//     const currentDate = new Date(Date.now());
//     const currentYear = currentDate.getFullYear();
//     const studentID=JSON.stringify(user._id).slice(0,5)
//     const emailAddress = user.email;
//     const firstname = user.firstname;
//     const message = `Welcome to Joulink digital hub. Your registration for ${
//       user.course
//     }track is almost completed.\n Your STUDENT ID is:  (${user.firstname.toUpperCase()}-${studentID}/${currentYear}). We are Super excited to have you with us!.\n Kindly confirm your email by clicking on the button below to complete your registration`;
//     const heading = 'Welcome';
//     const templatePath = path.join(__dirname, '../views/welcome.ejs');
//     const template = await ejs.renderFile(templatePath, {
//       message,
//       firstname,
//       heading,
//       url,
//     });

//     return this.sendEmail(emailAddress, message, heading, template);
//   }

//   async sendPasswordResetEmail(user, resetToken, url) {
//     const timeRemainingInMinutes = Math.max(0, Math.ceil((user.resetTimeExp - Date.now()) / 60000));
//     const firstname = user.firstname;
//     const emailAddress = user.email;
//     const message = `You have requested for a password reset Token. This token will be expiring in the next ${timeRemainingInMinutes} minutes \n Click the link provided to reset your password`;
//     const heading = 'Password Reset';
//     const templatePath = path.join(__dirname, '../views/reset.ejs');
//     const template = await ejs.renderFile(templatePath, {
//       message,
//       firstname,
//       heading,
//       url,
//       token: resetToken,
//     });

//     return this.sendEmail(emailAddress, message, heading, template);
//   }
// }

// module.exports = EmailSender;

module.exports = sendEmail;
