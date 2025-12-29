import express from "express";

import * as AdminController from "../controllers/admin";
import { requireAdminOrSuperAdmin, requireSignedIn, requireSuperAdmin } from "../middleware/auth";

const router = express.Router();

router.get(
  "/memberStats",
  requireSignedIn,
  requireAdminOrSuperAdmin,
  AdminController.getMemeberStats,
);

/**
 * GET /api/admins - Get all admin users for the data table
 */
router.get("/", requireSignedIn, requireSuperAdmin, AdminController.getAllAdmins);

export default router;
