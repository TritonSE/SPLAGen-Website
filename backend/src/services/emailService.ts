import { config } from "dotenv";
import nodemailer from "nodemailer";
import Mail from "nodemailer/lib/mailer";

import {
  DIRECTORY_APPROVAL_EMAIL,
  DIRECTORY_DENIAL_EMAIL,
  REASON_TEXT,
  RECIPIENT_TEXT,
  SIGN_OFF_HTML,
} from "./emailHtml";
config();

const sendEmail = async (options: Mail.Options) => {
  const transporter = nodemailer.createTransport({
    service: "gmail", // You can change this if you're using another provider
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_APP_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    //TODO: Uncommen IN PRODUCTION
    // cc: process.env.EMAIL_CC,
    ...options,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Failed to send email");
  }
};

const sendDirectoryApprovalEmail = async (to: string, name: string) => {
  const emailSubject = "Welcome to the SPLAGen Directory!";
  const emailHTML = DIRECTORY_APPROVAL_EMAIL.replace(RECIPIENT_TEXT, name) + SIGN_OFF_HTML;

  await sendEmail({
    to,
    subject: emailSubject,
    html: emailHTML,
    attachments: [
      {
        filename: "splagen_logo.png",
        path: `${__dirname}/../../public/splagen_logo.png`,
        cid: "splagen_logo.png",
      },
    ],
  });
};

const sendDirectoryDenialEmail = async (to: string, name: string, reason: string) => {
  const emailSubject = "Update on your SPLAGen Directory Application!";
  const emailHTML =
    DIRECTORY_DENIAL_EMAIL.replace(RECIPIENT_TEXT, name).replace(REASON_TEXT, reason) +
    SIGN_OFF_HTML;

  await sendEmail({
    to,
    subject: emailSubject,
    html: emailHTML,
    attachments: [
      {
        filename: "splagen_logo.png",
        path: `${__dirname}/../../public/splagen_logo.png`,
        cid: "splagen_logo.png",
      },
    ],
  });
};

export { sendDirectoryApprovalEmail, sendDirectoryDenialEmail };
