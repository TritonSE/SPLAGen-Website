import { body, param } from "express-validator";

import { validateRequest } from "./validateRequestHelper";

export const createReply = [
  body("postId").isMongoId().withMessage("Valid post ID is required"),
  body("message").isString().notEmpty().trim().withMessage("Message is required"),
  validateRequest,
];

export const getReplies = [
  param("postId").isMongoId().withMessage("Valid post ID is required"),
  validateRequest,
];

export const editReply = [
  param("id").isMongoId().withMessage("Valid reply ID is required"),
  body("message").isString().notEmpty().trim().withMessage("Message is required"),
  validateRequest,
];

export const deleteReply = [
  param("id").isMongoId().withMessage("Valid reply ID is required"),
  validateRequest,
];
