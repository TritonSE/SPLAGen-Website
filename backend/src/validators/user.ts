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

export const createUser = [
  body("name").isString().notEmpty().trim().withMessage("Name is required"),
  body("email").isEmail().normalizeEmail().withMessage("Valid email is required"),
  validateRequest,
];

export const deleteUser = [
  param("id").toInt().isInt().withMessage("Valid user ID is required"),
  validateRequest,
];

export const getUser = [
  param("id").toInt().isInt().withMessage("Valid user ID is required"),
  validateRequest,
];
