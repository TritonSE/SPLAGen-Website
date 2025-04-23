import express from "express";

import * as ReplyController from "../controllers/reply";
import { requireSignedIn } from "../middleware/auth";
import * as ReplyValidator from "../validators/reply";
const router = express.Router();

/**
 * Reply Routes
 * POST /api/replies - Create a reply post
 * GET /api/replies/:postId - Get reply posts for a discussion
 * PUT /api/replies/:id - Edit a reply post
 * DELETE /api/replies/:id - Delete a reply post
 */

router.post("/", requireSignedIn, ReplyValidator.createReply, ReplyController.createReply);
router.get("/:postId", requireSignedIn, ReplyValidator.getReplies, ReplyController.getReplies);
router.put("/:id", requireSignedIn, ReplyValidator.editReply, ReplyController.editReply);
router.delete("/:id", requireSignedIn, ReplyValidator.deleteReply, ReplyController.deleteReply);

export default router;
