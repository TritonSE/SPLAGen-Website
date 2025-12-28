import express from "express";

import * as AnnouncementController from "../controllers/announcement";
import { requireAdminOrSuperAdmin, requireSignedIn } from "../middleware/auth";
import * as AnnouncementValidator from "../validators/announcement";
const router = express.Router();

router.post(
  "/",
  requireSignedIn,
  requireAdminOrSuperAdmin,
  AnnouncementValidator.createOrEditAnnouncement,
  AnnouncementController.createAnnouncement,
);
router.put(
  "/:id",
  requireSignedIn,
  requireAdminOrSuperAdmin,
  AnnouncementValidator.createOrEditAnnouncement,
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
