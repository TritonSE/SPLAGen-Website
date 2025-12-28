import { body } from "express-validator";

import { validateRequest } from "./validateRequestHelper";

export const createOrEditAnnouncement = [
  body("title").isString().notEmpty().trim().withMessage("Title is required"),
  body("message").isString().notEmpty().trim().withMessage("Message text is required"),
  body("recipients")
    .custom(
      (value) =>
        Array.isArray(value) &&
        value.every(
          (email) =>
            typeof email === "string" &&
            (email === "everyone" || /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)),
        ),
    )
    .withMessage("Recipients must be 'everyone' or an array of valid email addresses."),
  validateRequest,
];
