import express from "express";

import * as AnnouncementController from "../controllers/announcement";

const router = express.Router();

router.post("/create", AnnouncementController.createAnnouncement);
router.put("/edit/:id", AnnouncementController.editAnnouncement);
router.delete("/delete/:id", AnnouncementController.deleteAnnouncement);
router.get("/all", AnnouncementController.getMultipleAnnouncements);
router.get("/:id", AnnouncementController.getIndividualAnnouncementDetails);

export default router;
