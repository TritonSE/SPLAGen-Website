import { config } from "dotenv";
import nodemailer from "nodemailer";
import Mail from "nodemailer/lib/mailer";

import env from "../util/validateEnv";

import {
  ACCOUNT_DELETION_EMAIL,
  ADMIN_INVITE_EMAIL,
  ADMIN_REMOVAL_EMAIL,
  ANNOUNCEMENT_MESSAGE,
  ANNOUNCEMENT_TITLE,
  ANNOUNCEMENT_URL,
  AUTHOR_NAME,
  DIRECTORY_APPROVAL_EMAIL,
  DIRECTORY_DENIAL_EMAIL,
  DIRECTORY_REMOVAL_EMAIL,
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
  getTemplate,
} from "./emailHtml";
config();

const EMAIL_SUBJECTS = {
  directoryApproval: {
    english: "Welcome to the SPLAGen Directory!",
    spanish: "¡Bienvenido/a al Directorio de SPLAGen!",
    portuguese: "Bem-vindo/a ao Diretório da SPLAGen!",
  },
  directoryDenial: {
    english: "Update on your SPLAGen Directory Application!",
    spanish: "Actualización sobre su solicitud al Directorio de SPLAGen",
    portuguese: "Atualização sobre sua candidatura ao Diretório da SPLAGen",
  },
  adminInvitation: {
    english: "Invitation to be a SPLAGen Admin",
    spanish: "Invitación para ser administrador/a de SPLAGen",
    portuguese: "Convite para ser administrador/a da SPLAGen",
  },
  adminRemoval: {
    english: "Removal as SPLAGen Admin",
    spanish: "Eliminación como administrador/a de SPLAGen",
    portuguese: "Remoção como administrador/a da SPLAGen",
  },
  accountDeletion: {
    english: "SPLAGen Membership Portal Account Deletion",
    spanish: "Eliminación de cuenta en el Portal de Membresía de SPLAGen",
    portuguese: "Exclusão de conta no Portal de Membros da SPLAGen",
  },
  directoryRemoval: {
    english: "Removal from SPLAGen Directory",
    spanish: "Eliminación del Directorio de SPLAGen",
    portuguese: "Remoção do Diretório da SPLAGen",
  },
  newAnnouncement: {
    english: "SPLAGen Membership Portal - New Announcement",
    spanish: "Portal de Membresía de SPLAGen - Nuevo anuncio",
    portuguese: "Portal de Membros da SPLAGen - Novo anúncio",
  },
  newDiscussionReply: {
    english: "SPLAGen Membership Portal - New Reply to a Discussion",
    spanish: "Portal de Membresía de SPLAGen - Nueva respuesta a una discusión",
    portuguese: "Portal de Membros da SPLAGen - Nova resposta a uma discussão",
  },
};

const LOGO_ATTACHMENT = {
  filename: "splagen_logo.png",
  path: `${__dirname}/../../public/splagen_logo.png`,
  cid: "splagen_logo.png",
};

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

const sendDirectoryApprovalEmail = async (to: string, name: string, lang?: string | null) => {
  const emailSubject = getTemplate(EMAIL_SUBJECTS.directoryApproval, lang);
  const emailHTML =
    getTemplate(DIRECTORY_APPROVAL_EMAIL, lang).replaceAll(RECIPIENT_TEXT, name) +
    getTemplate(SIGN_OFF_HTML, lang);

  await sendEmail({
    to,
    cc: env.EMAIL_CC,
    subject: emailSubject,
    html: emailHTML,
    attachments: [LOGO_ATTACHMENT],
  });
};

const sendDirectoryDenialEmail = async (
  to: string,
  name: string,
  reason: string,
  lang?: string | null,
) => {
  const emailSubject = getTemplate(EMAIL_SUBJECTS.directoryDenial, lang);
  const emailHTML =
    getTemplate(DIRECTORY_DENIAL_EMAIL, lang)
      .replaceAll(RECIPIENT_TEXT, name)
      .replaceAll(REASON_TEXT, reason) + getTemplate(SIGN_OFF_HTML, lang);

  await sendEmail({
    to,
    cc: env.EMAIL_CC,
    subject: emailSubject,
    html: emailHTML,
    attachments: [LOGO_ATTACHMENT],
  });
};

const sendAdminInvitationEmail = async (
  to: string,
  name: string,
  portalLink: string,
  lang?: string | null,
) => {
  const emailSubject = getTemplate(EMAIL_SUBJECTS.adminInvitation, lang);
  const emailHTML =
    getTemplate(ADMIN_INVITE_EMAIL, lang)
      .replaceAll(RECIPIENT_TEXT, name)
      .replaceAll(PORTAL_LINK, portalLink) + getTemplate(SIGN_OFF_HTML, lang);

  await sendEmail({
    to,
    cc: env.EMAIL_CC,
    subject: emailSubject,
    html: emailHTML,
    attachments: [LOGO_ATTACHMENT],
  });
};

const sendAdminRemovalEmail = async (
  to: string,
  name: string,
  reason: string,
  lang?: string | null,
) => {
  const emailSubject = getTemplate(EMAIL_SUBJECTS.adminRemoval, lang);
  const emailHTML =
    getTemplate(ADMIN_REMOVAL_EMAIL, lang)
      .replaceAll(RECIPIENT_TEXT, name)
      .replaceAll(REASON_TEXT, reason) + getTemplate(SIGN_OFF_HTML, lang);

  await sendEmail({
    to,
    cc: env.EMAIL_CC,
    subject: emailSubject,
    html: emailHTML,
    attachments: [LOGO_ATTACHMENT],
  });
};

const sendUserDeletionEmail = async (
  to: string,
  name: string,
  reason: string,
  lang?: string | null,
) => {
  const emailSubject = getTemplate(EMAIL_SUBJECTS.accountDeletion, lang);
  const emailHTML =
    getTemplate(ACCOUNT_DELETION_EMAIL, lang)
      .replaceAll(RECIPIENT_TEXT, name)
      .replaceAll(REASON_TEXT, reason) + getTemplate(SIGN_OFF_HTML, lang);

  await sendEmail({
    to,
    cc: env.EMAIL_CC,
    subject: emailSubject,
    html: emailHTML,
    attachments: [LOGO_ATTACHMENT],
  });
};

const sendDirectoryRemovalEmail = async (
  to: string,
  name: string,
  reason: string,
  lang?: string | null,
) => {
  const emailSubject = getTemplate(EMAIL_SUBJECTS.directoryRemoval, lang);
  const emailHTML =
    getTemplate(DIRECTORY_REMOVAL_EMAIL, lang)
      .replaceAll(RECIPIENT_TEXT, name)
      .replaceAll(REASON_TEXT, reason) + getTemplate(SIGN_OFF_HTML, lang);

  await sendEmail({
    to,
    cc: env.EMAIL_CC,
    subject: emailSubject,
    html: emailHTML,
    attachments: [LOGO_ATTACHMENT],
  });
};

const sendAnnouncementEmail = async (
  to: string,
  recipientName: string,
  authorName: string,
  announcementTitle: string,
  announcementMessage: string,
  announcementUrl: string,
  lang?: string | null,
) => {
  const emailSubject = getTemplate(EMAIL_SUBJECTS.newAnnouncement, lang);

  const emailHTML =
    getTemplate(NEW_ANNOUNCEMENT_EMAIL, lang)
      .replaceAll(RECIPIENT_TEXT, recipientName)
      .replaceAll(AUTHOR_NAME, authorName)
      .replaceAll(ANNOUNCEMENT_TITLE, announcementTitle)
      .replaceAll(ANNOUNCEMENT_MESSAGE, announcementMessage)
      .replaceAll(ANNOUNCEMENT_URL, announcementUrl) + getTemplate(SIGN_OFF_HTML, lang);

  await sendEmail({
    to,
    subject: emailSubject,
    html: emailHTML,
    attachments: [LOGO_ATTACHMENT],
  });
};

const sendDiscussionReplyEmail = async (
  to: string,
  recipientName: string,
  replierName: string,
  discussionTitle: string,
  replyMessage: string,
  discussionUrl: string,
  lang?: string | null,
) => {
  const emailSubject = getTemplate(EMAIL_SUBJECTS.newDiscussionReply, lang);

  const emailHTML =
    getTemplate(NEW_DISCUSSION_REPLY_EMAIL, lang)
      .replaceAll(RECIPIENT_TEXT, recipientName)
      .replaceAll(REPLIER_NAME, replierName)
      .replaceAll(DISCUSSION_TITLE, discussionTitle)
      .replaceAll(REPLY_MESSAGE, replyMessage)
      .replaceAll(DISCUSSION_URL, discussionUrl) + getTemplate(SIGN_OFF_HTML, lang);

  await sendEmail({
    to,
    subject: emailSubject,
    html: emailHTML,
    attachments: [LOGO_ATTACHMENT],
  });
};

export {
  sendDirectoryApprovalEmail,
  sendDirectoryDenialEmail,
  sendAdminInvitationEmail,
  sendAdminRemovalEmail,
  sendAnnouncementEmail,
  sendDiscussionReplyEmail,
  sendUserDeletionEmail,
  sendDirectoryRemovalEmail,
};
