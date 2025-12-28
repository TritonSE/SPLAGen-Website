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

    res.status(201).json(newReply);
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
    const discussionReplies = await Reply.find({ postId })
      .sort({ createdAt: -1 })
      .populate("userId");
    res.status(200).json(discussionReplies);
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
    const role = req.role;

    // Find the reply by ID
    const reply = await Reply.findById(id);
    if (!reply) {
      res.status(404).json({ error: "Reply not found" });
      return;
    }

    // Check if the user is the owner of the reply
    if (
      !reply.userId.equals(userUid) &&
      ![UserRole.ADMIN, UserRole.SUPERADMIN].includes(role as UserRole)
    ) {
      res.status(403).json({
        error: "Unauthorized: You can only edit your own replies if you are not an admin",
      });
      return;
    }

    // Update the reply
    reply.message = message;
    await reply.save();

    res.status(200).json(reply);
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
    const result = await Reply.deleteOne({ _id: id });
    if (!result.acknowledged) {
      res.status(400).json({ error: "Reply was not deleted" });
      return;
    }

    res.status(200).json({ message: "Reply deleted successfully" });
  } catch (error) {
    next(error);
  }
};
