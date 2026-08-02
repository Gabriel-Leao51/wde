const transporter = require('../config/mailer');

async function sendOtpEmail(email, code) {
  await transporter.sendMail({
    from: process.env.MAIL_FROM,
    to: email,
    subject: 'WDE Shop - Your Login Code',
    text: `Your one-time login code is: ${code}\n\nThis code expires in 10 minutes. If you didn't request this, you can safely ignore this email.`,
  });
}

module.exports = sendOtpEmail;
