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
  "/:id",
  requireSignedIn,
  requireAdminOrSuperAdmin,
  UserValidator.deleteUser,
  UserController.deleteUser,
);
router.get("/", requireSignedIn, UserController.getAllUsers);
router.get("/:id", requireSignedIn, UserValidator.getUser, UserController.getUser);
router.post("/authenticate", requireSignedIn, UserController.authenticateUser);

// Personal information routes
router.get("/personal-information", requireSignedIn, UserController.getPersonalInformation);
router.post("/personal-information", requireSignedIn, UserController.editPersonalInformation);

// Professional information routes
router.get("/professional-information", requireSignedIn, UserController.getProfessionalInformation);
router.post(
  "/professional-information",
  requireSignedIn,
  UserController.editProfessionalInformation,
);

// Directory personal information routes
router.get(
  "/directory/personal-information",
  requireSignedIn,
  UserController.getDirectoryPersonalInformation,
);
router.post(
  "/directory/personal-information",
  requireSignedIn,
  UserController.editDirectoryPersonalInformation,
);

// Directory display info routes
router.get("/directory/display-info", requireSignedIn, UserController.getDirectoryDisplayInfo);
router.post("/directory/display-info", requireSignedIn, UserController.editDirectoryDisplayInfo);

export default router;
