import { Request, Response, NextFunction } from 'express';
import { body, param, validationResult } from 'express-validator';

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

function validateRequest(req: Request, res: Response, next: NextFunction) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
}