const nodemailer = require("nodemailer");

// SMTP_USER/SMTP_PASS are only needed for a hosted inbox (e.g. Mailtrap); local Mailpit takes none.
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: +process.env.SMTP_PORT,
  secure: false,
  auth: process.env.SMTP_USER
    ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
    : undefined,
});

module.exports = transporter;
