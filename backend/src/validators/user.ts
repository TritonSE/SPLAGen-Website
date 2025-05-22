import { body, param } from "express-validator";

import { validateRequest } from "./validateRequestHelper";

export const createUser = [
  body("account").notEmpty().withMessage("Account information is required"),
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

export const deleteUser = [
  param("firebaseId").notEmpty().withMessage("Valid user ID is required"),
  validateRequest,
];

export const getUser = [
  param("firebaseId").notEmpty().withMessage("Valid user ID is required"),
  validateRequest,
];

export const editPersonalInformation = [
  body("newFirstName").isString().notEmpty().withMessage("First name is required"),
  body("newLastName").isString().notEmpty().withMessage("Last name is required"),
  body("newEmail").isEmail().withMessage("Valid email is required"),
  body("newPhone").optional().isString().withMessage("Valid phone number is required"),
  validateRequest,
];

export const editProfessionalInformation = [
  body("newTitle").isString().withMessage("Title must be a string"),
  body("newPrefLanguages").isArray({ min: 1 }).withMessage("Preferred languages must be an array"),
  body("newPrefLanguages.*")
    .isIn(["english", "spanish", "portuguese", "other"])
    .withMessage("Invalid preferred language"),
  body("newOtherPrefLanguages")
    .isString()
    .withMessage("Other preferred languages must be a string"),
  body("newCountry").optional().isString().withMessage("Country must be a string"),
  validateRequest,
];

export const editDirectoryPersonalInformation = [
  body("newDegree").isString().withMessage("Degree must be a string"),
  body("newEducationInstitution").isString().withMessage("Education institution is required"),
  body("newClinicName").isString().withMessage("Clinic name is required"),
  body("newClinicWebsiteUrl").isString().withMessage("Website must be a string"),
  body("newClinicAddress").isString().withMessage("Address is required"),
  body("newClinicCountry").isString().withMessage("Country is required"),
  body("newClinicApartmentSuite").optional().isString(),
  body("newClinicCity").optional().isString(),
  body("newClinicState").optional().isString(),
  body("newClinicZipPostCode").optional().isString(),
  validateRequest,
];

export const editDirectoryDisplayInfo = [
  body("newWorkEmail").isEmail().withMessage("Valid work email is required"),
  body("newWorkPhone").isString().withMessage("Work phone must be a string"),
  body("newServices").isArray({ min: 1 }).withMessage("Services must be a non-empty array"),
  body("newServices.*")
    .isIn([
      "pediatrics",
      "cardiovascular",
      "neurogenetics",
      "rareDiseases",
      "cancer",
      "biochemical",
      "prenatal",
      "adult",
      "psychiatric",
      "reproductive",
      "ophthalmic",
      "research",
      "pharmacogenomics",
      "metabolic",
      "other",
    ])
    .withMessage("Invalid service entry"),
  body("newLanguages").isArray({ min: 1 }).withMessage("Languages must be a non-empty array"),
  body("newLanguages.*")
    .isIn(["english", "spanish", "portuguese", "other"])
    .withMessage("Invalid language entry"),
  body("newLicense").isArray().withMessage("License must be an array"),
  body("newLicense.*").isString().withMessage("Each license entry must be a string"),
  body("newRemoteOption").isBoolean().withMessage("Remote option must be a boolean"),
  body("newRequestOption").isBoolean().withMessage("Request option must be a boolean"),
  validateRequest,
];
