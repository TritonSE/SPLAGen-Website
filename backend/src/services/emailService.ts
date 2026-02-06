import { config } from "dotenv";
import nodemailer from "nodemailer";
import Mail from "nodemailer/lib/mailer";

import env from "../util/validateEnv";

import {
  ADMIN_INVITE_EMAIL,
  ADMIN_REMOVAL_EMAIL,
  ANNOUNCEMENT_MESSAGE,
  ANNOUNCEMENT_TITLE,
  ANNOUNCEMENT_URL,
  AUTHOR_NAME,
  DIRECTORY_APPROVAL_EMAIL,
  DIRECTORY_DENIAL_EMAIL,
  DISCUSSION_TITLE,
  DISCUSSION_URL,
  NEW_ANNOUNCEMENT_EMAIL,
  NEW_DISCUSSION_REPLY_EMAIL,
  PORTAL_LINK,
  REASON_TEXT,
  RECIPIENT_TEXT,
  REPLIER_NAME,
  REPLY_MESSAGE,
  SIGN_OFF_HTML,
} from "./emailHtml";
config();

const sendEmail = async (options: Mail.Options) => {
  const transporter = nodemailer.createTransport({
    service: "gmail", // You can change this if you're using another provider
    auth: {
      user: env.EMAIL_USER,
      pass: env.EMAIL_APP_PASSWORD,
    },
  });

  const mailOptions = {
    from: env.EMAIL_USER,
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
    cc: env.EMAIL_CC,
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
    cc: env.EMAIL_CC,
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

const sendAdminInvitationEmail = async (to: string, name: string, portalLink: string) => {
  const emailSubject = "Invitation to be a SPLAGen Admin";
  const emailHTML =
    ADMIN_INVITE_EMAIL.replace(RECIPIENT_TEXT, name).replace(PORTAL_LINK, portalLink) +
    SIGN_OFF_HTML;

  await sendEmail({
    to,
    cc: env.EMAIL_CC,
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

const sendAdminRemovalEmail = async (to: string, name: string, reason: string) => {
  const emailSubject = "Removal as SPLAGen Admin";
  const emailHTML =
    ADMIN_REMOVAL_EMAIL.replace(RECIPIENT_TEXT, name).replace(REASON_TEXT, reason) + SIGN_OFF_HTML;

  await sendEmail({
    to,
    cc: env.EMAIL_CC,
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

const sendAnnouncementEmail = async (
  to: string,
  recipientName: string,
  authorName: string,
  announcementTitle: string,
  announcementMessage: string,
  announcementUrl: string,
) => {
  const emailSubject = "SPLAGen Membership Portal - New Announcement";

  const emailHTML =
    NEW_ANNOUNCEMENT_EMAIL.replace(RECIPIENT_TEXT, recipientName)
      .replace(AUTHOR_NAME, authorName)
      .replace(ANNOUNCEMENT_TITLE, announcementTitle)
      .replace(ANNOUNCEMENT_MESSAGE, announcementMessage)
      .replace(ANNOUNCEMENT_URL, announcementUrl) + SIGN_OFF_HTML;

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

const sendDiscussionReplyEmail = async (
  to: string,
  recipientName: string,
  replierName: string,
  discussionTitle: string,
  replyMessage: string,
  discussionUrl: string,
) => {
  const emailSubject = "SPLAGen Membership Portal - New Reply to Your Discussion";

  const emailHTML =
    NEW_DISCUSSION_REPLY_EMAIL.replace(RECIPIENT_TEXT, recipientName)
      .replace(REPLIER_NAME, replierName)
      .replace(DISCUSSION_TITLE, discussionTitle)
      .replace(REPLY_MESSAGE, replyMessage)
      .replace(DISCUSSION_URL, discussionUrl)
      .replace(DISCUSSION_URL, discussionUrl) + SIGN_OFF_HTML;

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

export {
  sendDirectoryApprovalEmail,
  sendDirectoryDenialEmail,
  sendAdminInvitationEmail,
  sendAdminRemovalEmail,
  sendAnnouncementEmail,
  sendDiscussionReplyEmail,
};
