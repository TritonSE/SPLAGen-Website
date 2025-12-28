import { body } from "express-validator";

import { validateRequest } from "./validateRequestHelper";

export const createOrEditDiscussion = [
  body("title").isString().notEmpty().trim().withMessage("Title is required"),
  body("message").isString().notEmpty().trim().withMessage("Message is required"),
  validateRequest,
];
