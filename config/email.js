const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    type: "OAuth2",
    user: process.env.MAIL_USERNAME,
    pass: process.env.MAIL_PASSWORD,
    clientId: process.env.OAUTH_CLIENTID,
    clientSecret: process.env.OAUTH_CLIENT_SECRET,
    refreshToken: process.env.OAUTH_REFRESH_TOKEN,
  },
});

const generateMail = ({ to, subject, text, html }) => {
  return {
    to: to,
    from: process.env.MAIL_USERNAME,
    subject: subject,
    text: text,
    html: html,
  };
};

module.exports = {
  generateMail,
  transporter,
};
