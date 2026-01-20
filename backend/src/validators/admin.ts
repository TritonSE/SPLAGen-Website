import { body } from "express-validator";

import { validateRequest } from "./validateRequestHelper";

export const removeAdmins = [
  body("userIds").isArray().withMessage("User IDs must be an array"),
  body("userIds.*").isString().isMongoId().withMessage("Each user ID must be a valid MongoDB ID"),
  validateRequest,
];
