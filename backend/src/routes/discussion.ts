import express from "express";

import * as DiscussionController from "../controllers/discussion";
import { requireAdminOrSuperAdmin, requireSignedIn } from "../middleware/auth";
import * as DiscussionValidator from "../validators/discussion";

const router = express.Router();

router.post(
  "/",
  requireSignedIn,
  DiscussionValidator.createDiscussion,
  DiscussionController.createDiscussion,
);
router.put(
  "/:id",
  requireSignedIn,
  DiscussionValidator.editDiscussion,
  DiscussionController.editDiscussion,
);
router.delete(
  "/:id",
  requireSignedIn,
  DiscussionValidator.deleteDiscussion,
  DiscussionController.deleteDiscussion,
);
router.delete(
  "/",
  requireSignedIn,
  requireAdminOrSuperAdmin,
  DiscussionValidator.deleteMultipleDiscussions,
  DiscussionController.deleteMultipleDiscussions,
);
router.get(
  "/",
  requireSignedIn,
  DiscussionValidator.getMultipleDiscussions,
  DiscussionController.getMultipleDiscussions,
);
router.get(
  "/:id",
  requireSignedIn,
  DiscussionValidator.getDiscussion,
  DiscussionController.getDiscussion,
);

export default router;
