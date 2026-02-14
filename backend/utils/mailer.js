import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

transporter.verify((error) => {
  if (error) console.error("❌ Mail error:", error);
  else console.log("✅ Mail server ready");
});

export const sendOtpMail = async (to, otp) => {
  await transporter.sendMail({
    from: `"SwadWala" <${process.env.EMAIL_USER}>`,
    to,
    subject: "SwadWala Password Reset OTP",
    html: `
      <h2>Your OTP</h2>
      <h1>${otp}</h1>
      <p>Valid for 5 minutes</p>
    `,
  });
};

export default transporter;
