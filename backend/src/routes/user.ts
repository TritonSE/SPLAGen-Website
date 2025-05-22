import express from "express";

import * as UserController from "../controllers/user";
import { requireAdminOrSuperAdmin, requireSignedIn } from "../middleware/auth";
import * as UserValidator from "../validators/user";

const router = express.Router();

/**
 * User directory routes
 * GET /api/users/whoami - Get current user
 * POST /api/users - Add user to directory
 * DELETE /api/users/:id - Remove user from directory
 * GET /api/users - Get all users in directory
 * GET /api/users/:id - Get specific user from directory
 */

router.get("/whoami", requireSignedIn, UserController.getWhoAmI);
router.post("/", UserValidator.createUser, UserController.createUser);
router.delete(
  "/:firebaseId",
  requireSignedIn,
  requireAdminOrSuperAdmin,
  UserValidator.deleteUser,
  UserController.deleteUser,
);
router.get("/", requireSignedIn, UserController.getAllUsers);
router.get("/:firebaseId", requireSignedIn, UserValidator.getUser, UserController.getUser);
router.post("/authenticate", requireSignedIn, UserController.authenticateUser);

// Personal information routes
router.get("/general/personal-information", requireSignedIn, UserController.getPersonalInformation);
router.put(
  "/general/personal-information",
  requireSignedIn,
  UserValidator.editPersonalInformation,
  UserController.editPersonalInformation,
);

// Professional information routes
router.put(
  "/general/professional-information",
  requireSignedIn,
  UserValidator.editProfessionalInformation,
  UserController.editProfessionalInformation,
);

// Directory personal information routes
router.get(
  "/directory/personal-information",
  requireSignedIn,
  UserController.getDirectoryPersonalInformation,
);
router.put(
  "/directory/personal-information",
  requireSignedIn,
  UserValidator.editDirectoryPersonalInformation,
  UserController.editDirectoryPersonalInformation,
);

// Directory display info routes
router.get("/directory/display-info", requireSignedIn, UserController.getDirectoryDisplayInfo);
router.put(
  "/directory/display-info",
  requireSignedIn,
  UserValidator.editDirectoryDisplayInfo,
  UserController.editDirectoryDisplayInfo,
);

export default router;
