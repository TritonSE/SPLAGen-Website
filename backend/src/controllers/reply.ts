import { NextFunction, Response } from "express";

import { AuthenticatedRequest } from "../middleware/auth";
import Reply from "../models/reply";
import { UserRole } from "../models/user";

type CreateReplyRequestBody = {
  postId: string;
  message: string;
};

type EditReplyRequestBody = {
  message: string;
};

export const createReply = async (
  req: AuthenticatedRequest<unknown, unknown, CreateReplyRequestBody>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.mongoID;
    const { postId, message } = req.body;

    const newReply = new Reply({ userId, postId, message });
    await newReply.save();

    res.status(201).json({ message: "Reply created successfully", reply: newReply });
  } catch (error) {
    next(error);
  }
};

export const getReplies = async (
  req: AuthenticatedRequest<{ postId: string }>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { postId } = req.params;
    const discussionReplies = await Reply.find({ postId });
    res.status(200).json({ replies: discussionReplies });
  } catch (error) {
    next(error);
  }
};

export const editReply = async (
  req: AuthenticatedRequest<{ id: string }, unknown, EditReplyRequestBody>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userUid = req.mongoID;
    const { id } = req.params;
    const { message } = req.body;

    // Find the reply by ID
    const reply = await Reply.findById(id);
    if (!reply) {
      res.status(404).json({ error: "Reply not found" });
      return;
    }

    // Check if the user is the owner of the reply
    if (!reply.userId.equals(userUid)) {
      res.status(403).json({ error: "Unauthorized: You can only edit your own replies" });
      return;
    }

    // Update the reply
    reply.message = message;
    await reply.save();

    res.status(200).json({ message: "Reply updated successfully", reply });
  } catch (error) {
    next(error);
  }
};

export const deleteReply = async (
  req: AuthenticatedRequest<{ id: string }>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const userUid = req.mongoID;
    const role = req.role;

    // Find the reply by ID
    const reply = await Reply.findById(id);
    if (!reply) {
      res.status(404).json({ error: "Reply not found" });
      return;
    }

    // Check if the user is the owner of the reply or an admin
    if (
      !reply.userId.equals(userUid) &&
      ![UserRole.ADMIN, UserRole.SUPERADMIN].includes(role as UserRole)
    ) {
      res
        .status(403)
        .json({ error: "Unauthorized: You can only delete your own posts or are an admin" });
      return;
    }

    // Delete the reply
    await Reply.deleteOne({ _id: id });

    res.status(200).json({ message: "Reply deleted successfully" });
  } catch (error) {
    next(error);
  }
};
