import express from "express";

import * as DiscussionController from "../controllers/discussion";
import * as DiscussionValidator from "../validators/discussion";

const router = express.Router();

router.post("/", DiscussionValidator.createDiscussion, DiscussionController.createDiscussion);
router.put("/:id", DiscussionValidator.editDiscussion, DiscussionController.editDiscussion);
router.delete("/:id", DiscussionValidator.deleteDiscussion, DiscussionController.deleteDiscussion);
router.delete(
  "/",
  DiscussionValidator.deleteMultipleDiscussions,
  DiscussionController.deleteMultipleDiscussions,
);
router.get(
  "/",
  DiscussionValidator.getMultipleDiscussions,
  DiscussionController.getMultipleDiscussions,
);
router.get("/:id", DiscussionValidator.getDiscussion, DiscussionController.getDiscussion);

export default router;
