import { body, param } from "express-validator";

import { validateRequest } from "./validateRequestHelper";

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
