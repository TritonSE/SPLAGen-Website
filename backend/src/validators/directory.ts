import { body } from "express-validator";

import { validateRequest } from "./validateRequestHelper";

export const requestJoinDirectory = [
  body("education").notEmpty().withMessage("Education is required"),
  body("education.degree").isString().withMessage("Degree is required"),
  body("education.otherDegree")
    .optional()
    .isString()
    .withMessage("Other degree must be a string is required"),
  body("education.institution").isString().withMessage("Institution is required"),

  body("clinic").notEmpty().withMessage("Clinic is required"),
  body("clinic.name").isString().withMessage("Clinic name is required"),
  body("clinic.url").isString().withMessage("Clinic website is required"),
  body("clinic.location").notEmpty().withMessage("Clinic location is required"),
  body("clinic.location.country").isString().withMessage("Clinic country is required"),
  body("clinic.location.address").isString().withMessage("Clinic address is required"),
  body("clinic.location.suite").optional().isString().withMessage("Clinic suite must be a string"),
  body("clinic.location.city").isString().withMessage("Clinic city is required"),
  body("clinic.location.state").isString().withMessage("Clinic state is required"),
  body("clinic.location.zipPostCode").isString().withMessage("Zip code is required"),

  body("display").notEmpty().withMessage("Display info is required"),
  body("display.workEmail").isString().withMessage("Work email is required"),
  body("display.workPhone").isString().withMessage("Work phone is required"),
  body("display.services").isArray().withMessage("Services must be an array "),
  body("display.services.*").isString().withMessage("All services must be strings"),
  body("display.languages").isArray().withMessage("Languages must be an array "),
  body("display.languages.*").isString().withMessage("All languages must be strings"),
  body("display.license").isArray().withMessage("Licenses must be an array "),
  body("display.license.*").isString().withMessage("All licenses must be strings"),

  body("display.options").notEmpty().withMessage("Display options are required"),
  body("display.options.openToAppointments")
    .isBoolean()
    .withMessage("Open to appointments is required"),
  body("display.options.openToRequests").isBoolean().withMessage("Open to requests is required"),
  body("display.options.remote").isBoolean().withMessage("Remote is required"),
  body("display.options.authorizedCare").notEmpty().withMessage("Authorized care is required"),

  body("display.comments").notEmpty().withMessage("Display comments are required"),
  body("display.comments.noLicense")
    .optional()
    .isString()
    .withMessage("No license comments must be a string"),
  body("display.comments.additional")
    .optional()
    .isString()
    .withMessage("Additional comments must be a string"),

  validateRequest,
];

export const approveDirectoryEntry = [
  //TODO: .isMongoId() if we end up sending mongoDB id
  body("firebaseId").notEmpty().trim().withMessage("Invalid UserId"),
  validateRequest,
];

export const denyDirectoryEntry = [
  //TODO: .isMongoId() if we end up sending mongoDB id
  body("firebaseId").notEmpty().trim().withMessage("Invalid UserId"),
  body("reason").isString().notEmpty().trim().withMessage("Reason is required"),
  validateRequest,
];
