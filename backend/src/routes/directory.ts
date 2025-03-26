import express from "express";

import * as DirectoryController from "../controllers/directory";
import {
  AuthenticatedRequest,
  requireAdminOrSuperAdmin,
  requireSignedIn,
} from "../middleware/auth";

const router = express.Router();

router.post(
  "/approve",
  requireSignedIn,
  requireAdminOrSuperAdmin,
  DirectoryController.approveDirectoryEntry,
);
router.post(
  "/deny",
  requireSignedIn,
  requireAdminOrSuperAdmin,
  DirectoryController.denyDirectoryEntry,
);

// TODO: take route
router.post("/test-signed-in", requireSignedIn, (req: AuthenticatedRequest, res) => {
  res.status(200).json({ fb: req.firebaseUid, role: req.role, db: req.mongoID });
});

router.post("/test-superadmin", requireSignedIn, requireAdminOrSuperAdmin, (req, res) => {
  res.status(200).send("Super admin access granted");
});

router.post("/test-admin-or-superadmin", requireAdminOrSuperAdmin, (req, res) => {
  res.status(200).send("Admin or super admin access granted");
});

export default router;
