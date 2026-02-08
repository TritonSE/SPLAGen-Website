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
  body("professional.title").optional().isString().withMessage("Title must be a string"),
  body("professional.prefLanguage")
    .optional()
    .isIn(["english", "spanish", "portuguese", "other"])
    .withMessage("Invalid preferred language"),
  body("professional.otherPrefLanguage")
    .optional()
    .isString()
    .withMessage("Other preferred language must be a string"),
  body("professional.country").optional().isString().withMessage("Country must be a string"),

  body("education").optional().notEmpty().withMessage("Education information is required"),
  body("education.degree").optional().isString().withMessage("Degree must be a string"),
  body("education.program").optional().isString().withMessage("Program must be a string"),
  body("education.otherDegree").optional().isString().withMessage("Other degree must be a string"),
  body("education.institution").optional().isString().withMessage("Institution must be a string"),
  body("education.email").optional().isString().withMessage("School email must be a string"),
  body("education.gradDate").optional().isString().withMessage("Graduation date must be a string"),

  body("associate").optional().notEmpty().withMessage("Associate information is required"),
  body("associate.title").optional().isString().withMessage("Title must be a string"),
  body("associate.specialization")
    .optional()
    .isString()
    .withMessage("Specialization must be a string"),
  body("associate.organization").optional().isString().withMessage("Organization must be a string"),

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
  body("newPrefLanguage")
    .isIn(["english", "spanish", "portuguese", "other"])
    .withMessage("Invalid preferred language"),
  body("newOtherPrefLanguage").isString().withMessage("Other preferred language must be a string"),
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
  body("newAppointmentsOption").isBoolean().withMessage("Appointments option must be a boolean"),
  body("newAuthorizedOption")
    .notEmpty()
    .withMessage("Authorized option must be a boolean or string"),
  validateRequest,
];

export const editProfilePicture = [
  body("profilePicture").optional().isString().withMessage("Profile picture URL must be a string"),
  validateRequest,
];

export const editMembership = [
  body("newMembership")
    .isIn(["student", "geneticCounselor", "healthcareProvider", "associate"])
    .withMessage("Invalid membership type"),
  validateRequest,
];

export const updateStudentInfo = [
  body("schoolCountry").isString().notEmpty().withMessage("School country is required"),
  body("schoolName").isString().notEmpty().withMessage("School name is required"),
  body("universityEmail").isEmail().withMessage("Valid university email is required"),
  body("degree").isString().notEmpty().withMessage("Degree is required"),
  body("programName").isString().notEmpty().withMessage("Program name is required"),
  body("gradDate").isString().notEmpty().withMessage("Graduation date is required"),
  validateRequest,
];

export const updateAssociateInfo = [
  body("jobTitle").isString().notEmpty().withMessage("Job title is required"),
  body("specialization")
    .isArray({ min: 1 })
    .withMessage("Specializations must be a non-empty array"),
  body("specialization.*").isString().withMessage("Each specialization must be a string"),
  body("isOrganizationRepresentative")
    .isIn(["yes", "no"])
    .withMessage("Organization representative must be 'yes' or 'no'"),
  body("organizationName").optional().isString().withMessage("Organization name must be a string"),
  validateRequest,
];

export const exportUsers = [
  body("userIds").optional().isArray().withMessage("User IDs must be an array"),
  body("userIds.*").optional().isString().withMessage("Each user ID must be a string"),
  body("search").optional().isString().withMessage("Search must be a string"),
  body("isAdmin").optional().isString().withMessage("isAdmin must be a string"),
  body("inDirectory").optional().isString().withMessage("inDirectory must be a string"),
  body("title").optional().isArray().withMessage("Title filter must be an array"),
  body("title.*").optional().isString().withMessage("Each title must be a string"),
  body("membership").optional().isArray().withMessage("Membership filter must be an array"),
  body("membership.*").optional().isString().withMessage("Each membership must be a string"),
  body("education").optional().isArray().withMessage("Education filter must be an array"),
  body("education.*").optional().isString().withMessage("Each education must be a string"),
  body("services").optional().isArray().withMessage("Services filter must be an array"),
  body("services.*").optional().isString().withMessage("Each service must be a string"),
  body("country").optional().isArray().withMessage("Country filter must be an array"),
  body("country.*").optional().isString().withMessage("Each country must be a string"),
  validateRequest,
];
