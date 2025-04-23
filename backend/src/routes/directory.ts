import express from "express";

import * as DirectoryController from "../controllers/directory";
import { requireAdminOrSuperAdmin, requireSignedIn } from "../middleware/auth";
import * as DirectoryValidator from "../validators/directory";

const router = express.Router();

router.post(
  "/approve",
  requireSignedIn,
  requireAdminOrSuperAdmin,
  DirectoryValidator.approveDirectoryEntry,
  DirectoryController.approveDirectoryEntry,
);
router.post(
  "/deny",
  requireSignedIn,
  requireAdminOrSuperAdmin,
  DirectoryValidator.denyDirectoryEntry,
  DirectoryController.denyDirectoryEntry,
);
router.post("/public", DirectoryController.getPublicDirectory);

export default router;
