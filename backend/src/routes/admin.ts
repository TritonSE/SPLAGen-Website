import express from "express";

import * as AdminController from "../controllers/admin";
import { requireAdminOrSuperAdmin, requireSignedIn, requireSuperAdmin } from "../middleware/auth";
import * as AdminValidator from "../validators/admin";

const router = express.Router();

router.get(
  "/memberStats",
  requireSignedIn,
  requireAdminOrSuperAdmin,
  AdminController.getMemberStats,
);

router.post("/invite/:id", requireSignedIn, requireSuperAdmin, AdminController.inviteAdmin);
router.post(
  "/remove",
  requireSignedIn,
  requireSuperAdmin,
  AdminValidator.removeAdmins,
  AdminController.removeAdmins,
);

/**
 * GET /api/admins - Get all admin users for the data table
 */
router.get("/", requireSignedIn, requireSuperAdmin, AdminController.getAllAdmins);

export default router;
