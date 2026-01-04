import { NextFunction, Response } from "express";
import { Types } from "mongoose";

import { AuthenticatedRequest } from "../middleware/auth";
import DiscussionModel from "../models/discussionPost";
import Reply from "../models/reply";
import { UserRole } from "../models/user";

type CreateOrEditDiscussionRequestBody = {
  title: string;
  message: string;
};

// Create a discussion post
export const createDiscussion = async (
  req: AuthenticatedRequest<unknown, unknown, CreateOrEditDiscussionRequestBody>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { title, message } = req.body;
    const userId = req.mongoID;

    const newDiscussion = new DiscussionModel({ userId, title, message });
    await newDiscussion.save();

    res.status(201).json(newDiscussion);
  } catch (error) {
    next(error);
  }
};

// Edit a discussion post
export const editDiscussion = async (
  req: AuthenticatedRequest<{ id: string }, unknown, CreateOrEditDiscussionRequestBody>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const { title, message } = req.body;
    const userId = req.mongoID;
    const role = req.role;

    // Ensure the id is valid
    const objectId = Types.ObjectId.isValid(id) ? new Types.ObjectId(id) : null;
    if (!objectId) {
      res.status(400).json({ error: "Invalid ID format" });
      return;
    }

    // Find the discussion by ID
    const discussion = await DiscussionModel.findById(objectId);
    if (!discussion) {
      res.status(404).json({ error: "Discussion not found" });
      return;
    }

    //Ensure user is the poster or an admin
    if (
      !discussion.userId.equals(userId) &&
      ![UserRole.ADMIN, UserRole.SUPERADMIN].includes(role as UserRole)
    ) {
      res
        .status(403)
        .json({ error: "Unauthorized: You can only edit your own posts if you are not an admin" });
      return;
    }

    // Update the discussion if the user is authorized
    const result = await DiscussionModel.findByIdAndUpdate(
      { _id: id },
      { $set: { title, message } },
      { returnDocument: "after" },
    );

    if (!result) {
      res.status(400).json({ error: "Discussion not updated" });
      return;
    }

    res.status(200).json(result);
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
    const userId = req.mongoID;
    const role = req.role;

    // Find the discussion by ID
    const discussion = await DiscussionModel.findById(id);
    if (!discussion) {
      res.status(404).json({ error: "Discussion not found" });
      return;
    }

    // Ensure user is the author or an admin
    if (
      !discussion.userId.equals(userId) &&
      ![UserRole.ADMIN, UserRole.SUPERADMIN].includes(role as UserRole)
    ) {
      res.status(403).json({
        error: "Unauthorized: You can only delete your own posts if you are not an admin",
      });
      return;
    }

    const result = await DiscussionModel.deleteOne({ _id: id });
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

// Get multiple discussion posts
export const getMultipleDiscussions = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const order = req.query.order;
    const newestFirst = order === "newest";
    const searchTerm = req.query.search;
    const mineOnly = req.query.mine === "true";
    const page = parseInt(req.query.page as string);
    const pageSize = parseInt(req.query.pageSize as string);

    const userId = req.mongoID;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const filters: any[] = [];

    // Text search
    if (searchTerm) {
      filters.push({
        $text: { $search: searchTerm },
      });
    }

    if (mineOnly) {
      filters.push({
        userId,
      });
    }

    const query = filters.length > 0 ? { $and: filters } : {};

    const total = await DiscussionModel.countDocuments(query);

    const discussions = await DiscussionModel.find(query)
      .sort({
        createdAt: newestFirst ? -1 : 1,
      })
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .populate("userId");

    res.status(200).json({ discussions, count: total });
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
    const discussion = await DiscussionModel.findById(id).populate("userId");

    if (!discussion) {
      res.status(404).json({ error: "Discussion not found" });
    }

    res.status(200).json(discussion);
  } catch (error) {
    next(error);
  }
};
