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
