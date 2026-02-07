import { body } from "express-validator";

import { validateRecipients } from "../models/announcement";

import { validateRequest } from "./validateRequestHelper";

export const createOrEditAnnouncement = [
  body("title").isString().notEmpty().trim().withMessage("Title is required"),
  body("message").isString().notEmpty().trim().withMessage("Message text is required"),
  body("recipients")
    .custom(validateRecipients)
    .withMessage(
      "Recipients must be 'everyone', 'language:<language>' (where language is english, spanish, portuguese, or other), or valid email addresses.",
    ),
  validateRequest,
];
