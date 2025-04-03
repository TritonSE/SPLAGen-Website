import { body } from "express-validator";

import { validateRequest } from "./validateRequestHelper";

export const createAnnouncement = [
  body("title").isString().notEmpty().trim().withMessage("Title is required"),
  body("message").isString().notEmpty().trim().withMessage("Message text is required"),
  body("recipients")
    .custom((value) => {
      if (typeof value === "string") {
        return value === "everyone";
      }
      if (Array.isArray(value)) {
        return value.every(
          (email) => typeof email === "string" && /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email),
        );
      }
      return false;
    })
    .withMessage("Channel must be 'everyone' or an array of valid email addresses."),
  validateRequest,
];
