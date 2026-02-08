import { body } from "express-validator";

import { validateRequest } from "./validateRequestHelper";

export const createReply = [
  body("postId").isMongoId().withMessage("Valid post ID is required"),
  body("message").isString().notEmpty().trim().withMessage("Message is required"),
  validateRequest,
];

export const editReply = [
  body("message").isString().notEmpty().trim().withMessage("Message is required"),
  validateRequest,
];
