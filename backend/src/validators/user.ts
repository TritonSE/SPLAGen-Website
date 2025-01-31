import { Request, Response, NextFunction } from 'express';
import { body, param, validationResult, Result, ValidationError } from 'express-validator';

function validateRequest(req: Request, res: Response, next: NextFunction): void {
  const errors: Result<ValidationError> = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }
  next();
}

export const createUser = [
  body('name').isString().notEmpty().trim().withMessage('Name is required'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  validateRequest
];

export const deleteUser = [
  param('id').isInt().withMessage('Valid user ID is required'),
  validateRequest
];

export const getUser = [
  param('id').isInt().withMessage('Valid user ID is required'),
  validateRequest
];

