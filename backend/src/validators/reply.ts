import { NextFunction, Request, Response } from "express";
import { Result, ValidationError, body, param, validationResult } from "express-validator";

function validateRequest(req: Request, res: Response, next: NextFunction): void {
  const errors: Result<ValidationError> = validationResult(req);
  if (!errors.isEmpty()) {
    const errorList: ValidationError[] = errors.array();
    res.status(400).json({ errors: errorList });
    return;
  }
  next();
}

export const createReply = [
  body("userId").isMongoId().withMessage("Valid user ID is required"),
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

