import express from "express";

import * as AnnouncementController from "../controllers/announcement";
import { requireAdminOrSuperAdmin, requireSignedIn } from "../middleware/auth";
import * as AnnouncementValidator from "../validators/announcement";
const router = express.Router();

//TODO add validators
router.post(
  "/",
  requireSignedIn,
  requireAdminOrSuperAdmin,
  AnnouncementValidator.createAnnouncement,
  AnnouncementController.createAnnouncement,
);
router.put(
  "/:id",
  requireSignedIn,
  requireAdminOrSuperAdmin,
  AnnouncementController.editAnnouncement,
);
router.delete(
  "/:id",
  requireSignedIn,
  requireAdminOrSuperAdmin,
  AnnouncementController.deleteAnnouncement,
);
router.get("/", requireSignedIn, AnnouncementController.getMultipleAnnouncements);
router.get("/:id", requireSignedIn, AnnouncementController.getIndividualAnnouncementDetails);

export default router;
