import express from "express";

import * as UserController from "../controllers/user";
import * as UserValidator from "../validators/user";

const router = express.Router();

/**
 * User directory routes
 * POST /api/users - Add user to directory
 * DELETE /api/users/:id - Remove user from directory
 * GET /api/users - Get all users in directory
 * GET /api/users/:id - Get specific user from directory
 */

router.post("/", UserValidator.createUser, UserController.createUser);
router.delete("/:id", UserValidator.deleteUser, UserController.deleteUser);
router.get("/", UserController.getAllUsers);
router.get("/:id", UserValidator.getUser, UserController.getUser);

router.get("/profile/personal-information", UserController.getPersonalInformation);
router.post("/profile/personal-information", UserController.editPersonalInformation);

router.get("/profile/professional-information", UserController.getProfessionalInformation);
router.post("/profile/professional-information", UserController.editProfessionalInformation);

router.get("/directory/personal-information", UserController.getDirectoryPersonalInformation);
router.post("/directory/personal-information", UserController.editDirectoryPersonalInformation);

router.get("/directory/display-info", UserController.getDirectoryDisplayInfo);
router.post("/directory/display-info", UserController.editDirectoryDisplayInfo);

export default router;
