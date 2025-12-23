const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "localhost",
  port: 1025,
  secure: false
});

async function sendActivationEmail(to, token) {
  const activationLink = `http://localhost:3000/activate-account?token=${token}`;

  await transporter.sendMail({
    from: '"HostLink" <no-reply@hostlink.com>',
    to,
    subject: "Activate your HostLink account",
    text: `Activate your account using this link: ${activationLink}`,
    html: `
      <h2>Welcome to HostLink</h2>
      <p>Please activate your account by clicking the link below:</p>
      <a href="${activationLink}">${activationLink}</a>
    `
  });
}

module.exports = sendActivationEmail;
