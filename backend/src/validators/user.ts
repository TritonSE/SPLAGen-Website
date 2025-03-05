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
  body("firebaseId").isString().notEmpty().withMessage("Firebase ID is required"),
  body("account").notEmpty().withMessage("Account information is required"),
  body("personal").notEmpty().withMessage("Personal information is required"),
  body("personal.firstName").isString().notEmpty().withMessage("First name is required"),
  body("personal.lastName").isString().notEmpty().withMessage("Last name is required"),
  body("personal.email").isEmail().withMessage("Valid email is required"),
  body("personal.email").normalizeEmail(),
  body("professional").optional().notEmpty().withMessage("Professional information is required"),
  body("education").optional().notEmpty().withMessage("Education information is required"),
  body("clinic").optional().notEmpty().withMessage("Clinic information is required"),
  body("display").optional().notEmpty().withMessage("Display information is required"),
  validateRequest,
];


export const deleteUser = [
  param("firebaseId").isString().notEmpty().withMessage("Valid Firebase ID is required"),
  validateRequest,
];

export const getUser = [
  param("firebaseId").isString().notEmpty().withMessage("Valid Firebase ID is required"),
  validateRequest,
];

export const getPersonalInformation = [
  param("firebaseId").isString().notEmpty().withMessage("Valid Firebase ID is required"),
  validateRequest,
];

export const editPersonalInformation = [
  body("firstName").isString().notEmpty().withMessage("First name is required"),
  body("lastName").isString().notEmpty().withMessage("Last name is required"),
  body("email").isEmail().withMessage("Valid email is required"),
  body("phone").optional().isString().withMessage("Valid phone number is required"),
  validateRequest,
];

export const getProfessionalInformation = [
  param("firebaseId").isString().notEmpty().withMessage("Valid Firebase ID is required"),
  validateRequest,
];

export const editProfessionalInformation = [
  body("title").optional().isString().withMessage("Title must be a string"),
  body("prefLanguages").optional().isArray().withMessage("Preferred languages must be an array"),
  body("otherPrefLanguages").optional().isArray().withMessage("Other preferred languages must be an array"),
  body("country").optional().isString().withMessage("Country must be a string"),
  validateRequest,
];

export const getDirectoryPersonalInformation = [
  param("firebaseId").isString().notEmpty().withMessage("Valid Firebase ID is required"),
  validateRequest,
];

export const editDirectoryPersonalInformation = [
  body("firstName").isString().notEmpty().withMessage("First name is required"),
  body("lastName").isString().notEmpty().withMessage("Last name is required"),
  body("email").isEmail().withMessage("Valid email is required"),
  body("phone").optional().isString().withMessage("Valid phone number is required"),
  validateRequest,
];

export const getDirectoryDisplayInfo = [
  param("firebaseId").isString().notEmpty().withMessage("Valid Firebase ID is required"),
  validateRequest,
];

export const editDirectoryDisplayInfo = [
  body("workEmail").optional().isEmail().withMessage("Valid work email is required"),
  body("workPhone").optional().isString().withMessage("Valid work phone number is required"),
  body("services").optional().isString().withMessage("Services must be a string"),
  body("languages").optional().isArray().withMessage("Languages must be an array"),
  body("license").optional().isString().withMessage("License must be a string"),
  body("options").optional().isString().withMessage("Options must be a string"),
  body("comments").optional().isString().withMessage("Comments must be a string"),
  validateRequest,
];