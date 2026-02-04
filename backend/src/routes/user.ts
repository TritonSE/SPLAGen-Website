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
router.get("/", requireSignedIn, requireAdminOrSuperAdmin, UserController.getUsers);
router.get(
  "/:firebaseId",
  requireSignedIn,
  requireAdminOrSuperAdmin,
  UserValidator.getUser,
  UserController.getUser,
);

// Personal information routes
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
router.put(
  "/directory/personal-information",
  requireSignedIn,
  UserValidator.editDirectoryPersonalInformation,
  UserController.editDirectoryPersonalInformation,
);

// Directory display info routes
router.put(
  "/directory/display-info",
  requireSignedIn,
  UserValidator.editDirectoryDisplayInfo,
  UserController.editDirectoryDisplayInfo,
);

// Profile picture routes
router.put(
  "/general/profile-picture",
  requireSignedIn,
  UserValidator.editProfilePicture,
  UserController.editProfilePicture,
);

// Membership routes
router.put(
  "/membership",
  requireSignedIn,
  UserValidator.editMembership,
  UserController.editMembership,
);

// Student information routes
router.put(
  "/general/student-information",
  requireSignedIn,
  UserValidator.updateStudentInfo,
  UserController.updateStudentInfo,
);

// Associate information routes
router.put(
  "/general/associate-information",
  requireSignedIn,
  UserValidator.updateAssociateInfo,
  UserController.updateAssociateInfo,
);

export default router;
