import { body } from "express-validator";

import { validateRequest } from "./validateRequestHelper";

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
