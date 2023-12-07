const nodemailer = require('nodemailer');

const mailSender = async (replyTo, email, title, body) => {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: 587,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    tls: {
      rejectUnauthorized: false,
    }
  });
  // Send emails to users
  transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    replyTo: replyTo,
    subject: title,
    html: body,
  }, function(err, info) {
    if(err) console.log(err)
    else console.log(info)
  });
};
module.exports = mailSender;