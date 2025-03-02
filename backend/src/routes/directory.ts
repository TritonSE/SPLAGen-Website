import express from "express";

import * as authController from "../controllers/auth";
import * as DirectoryController from "../controllers/directory";

const router = express.Router();

router.post("/approve", DirectoryController.approveDirectoryEntry);
router.post("/deny", DirectoryController.denyDirectoryEntry);
router.post("/test-signed-in", authController.requireSignedIn, (req, res) => {
  res.status(200).send("Signed in");
});

router.post("/test-admin", authController.requireAdmin, (req, res) => {
  res.status(200).send("Admin access granted");
});

router.post("/test-superadmin", authController.requireSuperAdmin, (req, res) => {
  res.status(200).send("Super admin access granted");
});

router.post("/test-admin-or-superadmin", authController.requireAdminOrSuperAdmin, (req, res) => {
  res.status(200).send("Admin or super admin access granted");
});

export default router;
