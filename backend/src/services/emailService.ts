import { config } from "dotenv";
import nodemailer from "nodemailer";
config();

const transporter = nodemailer.createTransport({
  service: "gmail", // You can change this if you're using another provider
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_APP_PASSWORD,
  },
});

const sendApprovalEmail = async (to: string, name: string) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject: "SPLAGen: Your Directory Approval",
    html: `<p>Dear ${name},</p><p>Your directory entry has been approved!</p><p>Thank you for your submission.</p>`,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending approval email:", error);
    throw new Error("Failed to send approval email");
  }
};

const sendDenialEmail = async (to: string, name: string, reason: string) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject: "SPLAGen: Your Directory Denial",
    html: `<p>Dear ${name},</p><p>Your directory entry has been denied for the following reason: ${reason}</p><p>If you have any questions, feel free to reach out.</p>`,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending denial email:", error);
    throw new Error("Failed to send denial email");
  }
};

export { sendApprovalEmail, sendDenialEmail };
