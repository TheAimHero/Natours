import nodemailer from 'nodemailer';

export async function sendEmail(email, subject, text) {
  const transporter = nodemailer.createTransport({
    host: String(process.env.EMAIL_HOST),
    port: Number(process.env.EMAIL_PORT),
    auth: {
      user: String(process.env.EMAIL_USERNAME),
      pass: String(process.env.EMAIL_PASSWORD),
    },
  });

  const mailOptions = {
    from: 'Natours" <X0qxv@example.com>',
    to: email,
    subject: subject,
    text: text,
  };

  await transporter.sendMail(mailOptions);
}
