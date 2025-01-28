import express from 'express';
import * as ReplyController from '../controllers/reply';
import * as ReplyValidator from '../validators/reply';

const router = express.Router();

/**
 * Reply Routes
 * POST /api/replies - Create a reply post
 * GET /api/replies/:discussionId - Get reply posts for a discussion
 * PUT /api/replies/:id - Edit a reply post
 * DELETE /api/replies/:id - Delete a reply post
 */

router.post('/', ReplyValidator.createReply, ReplyController.createReply);
router.get('/:discussionId', ReplyValidator.getReplies, ReplyController.getReplies);
router.put('/:id', ReplyValidator.editReply, ReplyController.editReply);
router.delete('/:id', ReplyValidator.deleteReply, ReplyController.deleteReply);

export default router;
