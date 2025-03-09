import { NextFunction, Request, Response } from "express";
import { AuthenticatedRequest } from "./auth";
import { Types } from "mongoose";

import discussionPost from "../models/discussionPost";

type DiscussionRequestBody = {
  userId: string;
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
  req: AuthenticatedRequest & Request<unknown, unknown, DiscussionRequestBody>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { userId, title, message, channel } = req.body;
    if (!userUid) {
      res.status(403).json({ error: "User not signed in" });
      return
    }
    if (!title || !content) {
      res.status(400).json({ error: "Title and content are required" });
      return;
    }
    const newDiscussion = new discussionPost({ userId, title, message, channel, replies: [] });
    await newDiscussion.save();
    res.status(201).json({ message: "Discussion created successfully", discussion: newDiscussion });
  } catch (error) {
    next(error);
  }
};

// Edit a discussion post
export const editDiscussion = async (
  req:  AuthenticatedRequest & Request<{ id: string }, unknown, EditDiscussionRequestBody>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const { title, message, channel } = req.body;

    // Ensure the id is valid
    const objectId = Types.ObjectId.isValid(id) ? new Types.ObjectId(id) : null;
    if (!objectId) {
      res.status(400).json({ error: "Invalid ID format" });
    }
    if (!userUid) {
      res.status(403).json({ error: "User not signed in" });
      return
    }

    const discussion = await discussionPost.findByIdAndUpdate(
      objectId,
      { title, message, channel },
      { new: true },
    );

    if (!discussion) {
      res.status(404).json({ error: "Discussion not found" });
    }
    if (discussion.userId !== userUid) {
      res.status(403).json({ error: "Unauthorized: You can only delete your own posts" });
      return;
    }

    res.status(200).json({ message: "Discussion updated successfully", discussion });
  } catch (error) {
    next(error);
  }
};

// Delete a discussion post
export const deleteDiscussion = async (
  req:  AuthenticatedRequest & Request<{ id: string }>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const discussion = await discussionPost.findByIdAndDelete(id);
    const { userUid } = req.body as { userUid: string };

    if (!discussion) {
      res.status(404).json({ error: "Discussion not found" });
    }
    if (!userUid) {
      res.status(403).json({ error: "User not signed in" });
      return
    }
    const discussion = discussions[index];
    if (discussion.userId !== userUid) {
      res.status(403).json({ error: "Unauthorized: You can only delete your own posts" });
      return;
    }

    res.status(200).json({ message: "Discussion deleted successfully" });
  } catch (error) {
    next(error);
  }
};

// Delete multiple discussion posts
export const deleteMultipleDiscussions = async (
  req:  AuthenticatedRequest & Request<unknown, unknown, DeleteMultipleDiscussionsRequestBody>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { ids, userUid } = req.body;

    if (!userUid) {
      res.status(403).json({ error: "User not signed in" });
    }

    const result = await discussionPost.deleteMany({ _id: { $in: ids } });

    res.status(200).json({
      message: `${result.deletedCount.toString()} discussion(s) deleted successfully`,
    });
  } catch (error) {
    next(error);
  }
};

// Get multiple discussion posts
export const getMultipleDiscussions = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const discussions = await discussionPost.find();
    res.status(200).json({ discussions });
  } catch (error) {
    next(error);
  }
};

// Get an individual discussion post
export const getDiscussion = async (
  req: Request<{ id: string }>,
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
