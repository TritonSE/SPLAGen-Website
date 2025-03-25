import { NextFunction, Request, Response } from "express";
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
  req: Request<unknown, unknown, DiscussionRequestBody>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { userId, title, message, channel } = req.body;
    const newDiscussion = new discussionPost({ userId, title, message, channel, replies: [] });
    await newDiscussion.save();
    res.status(201).json({ message: "Discussion created successfully", discussion: newDiscussion });
  } catch (error) {
    next(error);
  }
};

// Edit a discussion post
export const editDiscussion = async (
  req: Request<{ id: string }, unknown, EditDiscussionRequestBody>,
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

    const discussion = await discussionPost.findByIdAndUpdate(
      objectId,
      { title, message, channel },
      { new: true },
    );

    if (!discussion) {
      res.status(404).json({ error: "Discussion not found" });
    }

    res.status(200).json({ message: "Discussion updated successfully", discussion });
  } catch (error) {
    next(error);
  }
};

// Delete a discussion post
export const deleteDiscussion = async (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const discussion = await discussionPost.findByIdAndDelete(id);

    if (!discussion) {
      res.status(404).json({ error: "Discussion not found" });
    }

    res.status(200).json({ message: "Discussion deleted successfully" });
  } catch (error) {
    next(error);
  }
};

// Delete multiple discussion posts
export const deleteMultipleDiscussions = async (
  req: Request<unknown, unknown, DeleteMultipleDiscussionsRequestBody>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { ids } = req.body;
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
