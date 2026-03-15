import nodemailer from "nodemailer";
import dns from "dns";

dns.setDefaultResultOrder("ipv4first");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const sendEmail = async ({ to, subject, html }) => {
  try {
    console.log("📧 Preparing to send email...");
    console.log("📧 To:", to);

    const info = await transporter.sendMail({
      from: `"VizorLite" <${process.env.SMTP_USER}>`,
      to,
      subject,
      html,
    });

    console.log("✅ Email sent successfully");
    console.log("📧 Message ID:", info.messageId);
    console.log("📧 Accepted:", info.accepted);

  } catch (error) {
    console.error("❌ EMAIL SEND ERROR:");
    console.error(error);
  }
}