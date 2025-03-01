import { NextFunction, Request, Response } from "express";
import Reply from "../models/reply";

// Temporary storage until database is set up
type Reply = {
  id: number;
  discussionId: number;
  content: string;
};

// Temporary storage until database is set up
const replies: Reply[] = [];

export const createReply = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId, postId, message } = req.body;

    const newReply = new Reply({ userId, postId, message });
    await newReply.save();

    res.status(201).json({ message: "Reply created successfully", reply: newReply });
  } catch (error) {
    next(error);
  }
};

export const getReplies = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { postId } = req.params;
    const discussionReplies = await Reply.find({ postId });
    res.status(200).json({ replies: discussionReplies });
  } catch (error) {
    next(error);
  }
};

export const editReply = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { message } = req.body;

    const updatedReply = await Reply.findByIdAndUpdate(id, { message }, { new: true });
    if (!updatedReply) {
      res.status(404).json({ error: "Reply not found" });
    }

    res.status(200).json({ message: "Reply updated successfully", reply: updatedReply });
  } catch (error) {
    next(error);
  }
};

export const deleteReply = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const deletedReply = await Reply.findByIdAndDelete(id);
    if (!deletedReply) {
      res.status(404).json({ error: "Reply not found" });
    }

    res.status(200).json({ message: "Reply deleted successfully" });
  } catch (error) {
    next(error);
  }
};
