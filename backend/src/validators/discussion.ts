import { NextFunction, Request, Response } from "express";
import { Result, ValidationError, body, param, query, validationResult } from "express-validator";
import mongoose from "mongoose";

function validateRequest(req: Request, res: Response, next: NextFunction): void {
  const errors: Result<ValidationError> = validationResult(req);
  if (!errors.isEmpty()) {
    const errorList: ValidationError[] = errors.array();
    res.status(400).json({ errors: errorList });
    return;
  }
  next();
}

export const createDiscussion = [
  body("title").isString().notEmpty().trim().withMessage("Title is required"),
  body("message").isString().notEmpty().trim().withMessage("Message is required"),
  validateRequest,
];

export const editDiscussion = [
  param("id").isMongoId().withMessage("Invalid MongoDB ObjectId"),
  body("title").optional().isString().trim().withMessage("Title must be a string"),
  body("content").optional().isString().trim().withMessage("Content must be a string"),
  validateRequest,
];

export const deleteDiscussion = [
  param("id").isMongoId().withMessage("Invalid MongoDB ObjectId"),
  validateRequest,
];

export const deleteMultipleDiscussions = [
  body("ids")
    .isArray({ min: 1 })
    .withMessage("IDs must be an array with at least one element")
    .custom((ids: unknown) => 
      Array.isArray(ids) && ids.every((id) => mongoose.Types.ObjectId.isValid(id))
    )
    .withMessage("All IDs must be valid MongoDB ObjectIds"),
  validateRequest,
];

export const getMultipleDiscussions = [
  query("page").optional().toInt().isInt({ min: 1 }).withMessage("Page must be a positive integer"),
  query("limit")
    .optional()
    .toInt()
    .isInt({ min: 1 })
    .withMessage("Limit must be a positive integer"),
  validateRequest,
];

export const getDiscussion = [
  param("id").isMongoId().withMessage("Invalid MongoDB ObjectId"),
  validateRequest,
];
