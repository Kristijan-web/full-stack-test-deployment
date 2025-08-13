import nodemailer from "nodemailer";
async function sendEmail(options) {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: { user: process.env.EMAIL_USER, pass: process.env.PASS_USER },
    });
    await transporter.sendMail(options);
}
export default sendEmail;
