const nodemailer = require("nodemailer");
// const fs = require("fs");
// const path = require("path");

const sendEmail = async (email, subject, payload) => {
  try {
    // create reusable transporter object using the default SMTP transport
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: 2525,
      auth: {
        user: process.env.FROM_EMAIL,
        pass: process.env.EMAIL_PASSWORD, // naturally, replace both with your real credentials or an application-specific password
      },
    });

    const mailOptions = () => {
      return {
        from: process.env.FROM_EMAIL,
        to: process.env.FROM_EMAIL,
        subject: "reset password",
        text: "Use the link to reset your password",
      };
    };

    // Send email
    transporter.sendMail(mailOptions(), (error, info) => {
      if (error) {
        return error;
      } else {
        return res.status(200).json({
          success: true,
        });
      }
    });
  } catch (error) {
    return error;
  }
};

/*
Example:
sendEmail(
  "youremail@gmail.com,
  "Email subject",
  { name: "Eze" },
  "./templates/layouts/main.handlebars"
);
*/

module.exports = sendEmail;
