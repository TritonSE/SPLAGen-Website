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

export const createReply = [
  body('content').isString().notEmpty().trim().withMessage('Content is required'),
  body('discussionId').isInt().withMessage('Valid discussion ID is required'),
  validateRequest,
];

export const getReplies = [
  param('discussionId').isInt().withMessage('Valid discussion ID is required'),
  validateRequest,
];

export const editReply = [
  param('id').isInt().withMessage('Valid reply ID is required'),
  body('content').isString().notEmpty().trim().withMessage('Content is required'),
  validateRequest,
];

export const deleteReply = [
  param('id').isInt().withMessage('Valid reply ID is required'),
  validateRequest,
];

