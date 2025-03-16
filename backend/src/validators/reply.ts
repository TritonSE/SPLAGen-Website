import { body, param } from "express-validator";

import { validateRequest } from "./validateRequestHelper";

export const createReply = [
  body("content").isString().notEmpty().trim().withMessage("Content is required"),
  body("discussionId").toInt().isInt().withMessage("Valid discussion ID is required"),
  validateRequest,
];

export const getReplies = [
  param("discussionId").toInt().isInt().withMessage("Valid discussion ID is required"),
  validateRequest,
];

export const editReply = [
  param("id").toInt().isInt().withMessage("Valid reply ID is required"),
  body("content").isString().notEmpty().trim().withMessage("Content is required"),
  validateRequest,
];

export const deleteReply = [
  param("id").toInt().isInt().withMessage("Valid reply ID is required"),
  validateRequest,
];
