import express from "express";

import * as DiscussionController from "../controllers/discussion";
import { requireSignedIn } from "../middleware/auth";
import * as DiscussionValidator from "../validators/discussion";

const router = express.Router();

router.post(
  "/",
  requireSignedIn,
  DiscussionValidator.createOrEditDiscussion,
  DiscussionController.createDiscussion,
);
router.put(
  "/:id",
  requireSignedIn,
  DiscussionValidator.createOrEditDiscussion,
  DiscussionController.editDiscussion,
);
router.delete("/:id", requireSignedIn, DiscussionController.deleteDiscussion);
router.get("/", requireSignedIn, DiscussionController.getMultipleDiscussions);
router.get("/:id", requireSignedIn, DiscussionController.getDiscussion);

export default router;
