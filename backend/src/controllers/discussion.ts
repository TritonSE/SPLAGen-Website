import { NextFunction, Response } from "express";
import { Types } from "mongoose";

import { AuthenticatedRequest } from "../middleware/auth";
import discussionPost from "../models/discussionPost";
import Reply from "../models/reply";
import { UserRole } from "../models/user";

type DiscussionRequestBody = {
  title: string;
  message: string;
  channel: string;
};

type EditDiscussionRequestBody = {
  title?: string;
  message?: string;
  channel?: string;
};

type DeleteMultipleDiscussionsRequestBody = {
  ids: string[];
};

// Create a discussion post
export const createDiscussion = async (
  req: AuthenticatedRequest<unknown, unknown, DiscussionRequestBody>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { title, message, channel } = req.body;
    const userId = req.mongoID;

    const newDiscussion = new discussionPost({ userId, title, message, channel });
    await newDiscussion.save();

    res.status(201).json({ message: "Discussion created successfully", discussion: newDiscussion });
  } catch (error) {
    next(error);
  }
};

// Edit a discussion post
export const editDiscussion = async (
  req: AuthenticatedRequest<{ id: string }, unknown, EditDiscussionRequestBody>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const { title, message, channel } = req.body;
    const userUid = req.mongoID;

    // Ensure the id is valid
    const objectId = Types.ObjectId.isValid(id) ? new Types.ObjectId(id) : null;
    if (!objectId) {
      res.status(400).json({ error: "Invalid ID format" });
      return;
    }

    // Find the discussion by ID
    const discussion = await discussionPost.findById(objectId);
    if (!discussion) {
      res.status(404).json({ error: "Discussion not found" });
      return;
    }

    //Ensure user is the poster
    if (!discussion.userId.equals(userUid)) {
      res.status(403).json({ error: "Unauthorized: You can only edit your own posts" });
      return;
    }

    // Update the discussion if the user is authorized
    const result = await discussionPost.updateOne(
      { _id: objectId },
      { $set: { title, message, channel } },
    );

    if (!result.acknowledged) {
      res.status(400).json({ error: "Discussion not updated" });
      return;
    }

    res.status(200).json({ message: "Discussion updated successfully", discussion });
  } catch (error) {
    next(error);
  }
};

// Delete a discussion post
export const deleteDiscussion = async (
  req: AuthenticatedRequest<{ id: string }>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const userUid = req.mongoID;
    const role = req.role;

    // Find the discussion by ID
    const discussion = await discussionPost.findById(id);
    if (!discussion) {
      res.status(404).json({ error: "Discussion not found" });
      return;
    }

    if (
      !discussion.userId.equals(userUid) &&
      ![UserRole.ADMIN, UserRole.SUPERADMIN].includes(role as UserRole)
    ) {
      res
        .status(403)
        .json({ error: "Unauthorized: You can only delete your own posts or are an admin" });
      return;
    }

    const result = await discussionPost.deleteOne({ _id: id });
    if (!result.acknowledged) {
      res.status(400).json({ error: "Discussion was not deleted" });
      return;
    }

    // Delete replies associated with the discussion
    await Reply.deleteMany({ postId: id });

    res.status(200).json({ message: "Discussion deleted successfully" });
  } catch (error) {
    next(error);
  }
};

// Delete multiple discussion posts
export const deleteMultipleDiscussions = async (
  req: AuthenticatedRequest<unknown, unknown, DeleteMultipleDiscussionsRequestBody>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { ids } = req.body;

    const result = await discussionPost.deleteMany({ _id: { $in: ids } });
    if (!result.acknowledged) {
      res.status(400).json({ error: "Discussions was not deleted" });
      return;
    }

    // Delete replies associated with the discussions
    await Reply.deleteMany({ postId: { $in: ids } });

    res.status(200).json({
      message: `${result.deletedCount.toString()} discussion(s) deleted successfully`,
    });
  } catch (error) {
    next(error);
  }
};

// Get multiple discussion posts
export const getMultipleDiscussions = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const discussions = await discussionPost.find();
    res.status(200).json({ discussions });
  } catch (error) {
    next(error);
  }
};

// Get an individual discussion post
export const getDiscussion = async (
  req: AuthenticatedRequest<{ id: string }>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const discussion = await discussionPost.findById(id);

    if (!discussion) {
      res.status(404).json({ error: "Discussion not found" });
    }

    res.status(200).json({ discussion });
  } catch (error) {
    next(error);
  }
};
