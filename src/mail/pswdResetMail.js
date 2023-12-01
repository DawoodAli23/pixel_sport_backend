// resetPassword.js
const nodemailer = require("nodemailer");
const otpGenerator = require("otp-generator");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "sallumia9090@gmail.com",
    pass: "iqbdpsqwarmowsmj",
  },
});

const urlPage = "https://cosmic-baklava-58c11d.netlify.app/otppassword";

function sendEmailWithOTP(email, otp) {
  const mailOptions = {
    from: "<sallumia9090@gmail.com>",
    to: email,
    subject: "Password Reset OTP",
    text: `Please follow link ${urlPage} Your OTP for password reset is ${otp}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log("Error sending email:", error);
    } else {
      console.log("Email sent:", info.response);
    }
  });
}

// function generateOTP() {
//   return otpGenerator.generate(6, {
//     digits: true,
//     alphabets: false,
//     upperCase: false,
//     specialChars: false,
//   });
// }

module.exports = { sendEmailWithOTP };
