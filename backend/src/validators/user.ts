import { body } from "express-validator";

import { validateRequest } from "./validateRequestHelper";

export const createUser = [
  body("account").notEmpty().withMessage("Account information is required"),
  body("account.type")
    .isIn(["superadmin", "admin", "counselor", "student"])
    .withMessage("Account type must be one of: superadmin, admin, counselor, student"),
  body("account.inDirectory").isBoolean().withMessage("Directory status must be a boolean"),
  body("account.profilePicture")
    .optional()
    .isString()
    .withMessage("Profile picture must be a string"),
  body("account.membership")
    .isIn(["student", "geneticCounselor", "healthcareProvider", "associate"])
    .withMessage("Invalid membership type"),

  body("personal").notEmpty().withMessage("Personal information is required"),
  body("personal.firstName").isString().notEmpty().withMessage("First name is required"),
  body("personal.lastName").isString().notEmpty().withMessage("Last name is required"),
  body("personal.email").isEmail().withMessage("Valid email is required"),
  body("personal.email").normalizeEmail(),
  body("personal.phone").optional().isString().withMessage("Phone number must be a valid string"),

  body("professional").optional().notEmpty().withMessage("Professional information is required"),
  body("education").optional().notEmpty().withMessage("Education information is required"),
  body("clinic").optional().notEmpty().withMessage("Clinic information is required"),
  body("display").optional().notEmpty().withMessage("Display information is required"),

  validateRequest,
];

export const deleteUser = [validateRequest];

export const getUser = [validateRequest];

export const getPersonalInformation = [validateRequest];

export const editPersonalInformation = [
  body("newFirstName").isString().notEmpty().withMessage("First name is required"),
  body("newLastName").isString().notEmpty().withMessage("Last name is required"),
  body("newEmail").isEmail().withMessage("Valid email is required"),
  body("newPhone").optional().isString().withMessage("Valid phone number is required"),
  validateRequest,
];

export const getProfessionalInformation = [validateRequest];

export const editProfessionalInformation = [
  body("newTitle").optional().isString().withMessage("Title must be a string"),
  body("newPrefLanguages").optional().isArray().withMessage("Preferred languages must be an array"),
  body("newOtherPrefLanguages")
    .optional()
    .isString()
    .withMessage("Other preferred languages must be a string"),
  body("newCountry").optional().isString().withMessage("Country must be a string"),
  validateRequest,
];

export const getDirectoryPersonalInformation = [validateRequest];

export const editDirectoryPersonalInformation = [
  body("newDegree").isString().withMessage("Degree must be a string"),
  body("newEducationInstitution").isString().withMessage("Education institution must be a string"),
  body("newClinicName").isString().withMessage("Clinic name must be a string"),
  body("newClinicWebsiteUrl")
    .optional()
    .isString()
    .withMessage("Clinic website URL must be a string"),
  body("newClinicAddress").isString().withMessage("Clinic address must be a string"),
  validateRequest,
];

export const getDirectoryDisplayInfo = [validateRequest];

export const editDirectoryDisplayInfo = [
  body("newWorkEmail").optional().isEmail().withMessage("Valid work email is required"),
  body("newWorkPhone").optional().isString().withMessage("Valid work phone number is required"),
  body("newServices").optional().isArray().withMessage("Services must be an array of strings"),
  body("newLanguages").optional().isArray().withMessage("Languages must be an array of strings"),
  body("newLicense").optional().isArray().withMessage("License must be an array of strings"),
  body("newRemoteOption").optional().isBoolean().withMessage("Remote option must be a boolean"),
  body("newRequestOption").optional().isBoolean().withMessage("Request option must be a boolean"),
  validateRequest,
];
