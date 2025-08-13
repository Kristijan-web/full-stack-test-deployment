import nodemailer from "nodemailer";
// hocu da email bude iz instance usera, znaci treba mi HydratedDocument<User>

type Options = {
  from: string;
  to: string;
  subject: string;
  text: string;
};

async function sendEmail(options: Options) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user: process.env.EMAIL_USER, pass: process.env.PASS_USER },
  });

  await transporter.sendMail(options);
}

export default sendEmail;
