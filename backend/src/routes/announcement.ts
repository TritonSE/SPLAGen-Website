import express from "express";

import * as AnnouncementController from "../controllers/announcement";
import { requireAdminOrSuperAdmin, requireSignedIn } from "../middleware/auth";
const router = express.Router();

//TODO add validators
router.post(
  "/create",
  requireSignedIn,
  requireAdminOrSuperAdmin,
  AnnouncementController.createAnnouncement,
);
router.put(
  "/edit/:id",
  requireSignedIn,
  requireAdminOrSuperAdmin,
  AnnouncementController.editAnnouncement,
);
router.delete(
  "/delete/:id",
  requireSignedIn,
  requireAdminOrSuperAdmin,
  AnnouncementController.deleteAnnouncement,
);
router.get("/all", requireSignedIn, AnnouncementController.getMultipleAnnouncements);
router.get("/:id", requireSignedIn, AnnouncementController.getIndividualAnnouncementDetails);

export default router;
