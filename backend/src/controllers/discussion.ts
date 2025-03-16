import { Request, Response } from "express";

import { AuthenticatedRequest } from "./auth";

// Temporary storage for discussion posts
type Discussion = {
  id: number;
  title: string;
  content: string;
  userId: string;
};

const discussions: Discussion[] = [];

// Create a discussion post
export const createDiscussion = (req: AuthenticatedRequest, res: Response) => {
  try {
    const { title, content, userUid } = req.body as {
      title: string;
      content: string;
      userUid: string;
    };
    if (!userUid) {
      res.status(403).json({ error: "User not signed in" });
      return;
    }
    if (!title || !content) {
      res.status(400).json({ error: "Title and content are required" });
      return;
    }
    const newDiscussion: Discussion = {
      id: discussions.length + 1,
      title,
      content,
      userId: userUid,
    };
    discussions.push(newDiscussion);
    res.status(201).json({ message: "Discussion created successfully", discussion: newDiscussion });
  } catch (error) {
    console.error("Error creating discussion:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Edit a discussion post
export const editDiscussion = (req: AuthenticatedRequest, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    const { title, content, userUid } = req.body as {
      title: string;
      content: string;
      userUid: string;
    };

    if (!title || !content) {
      res.status(400).json({ error: "Title and content are required to update discussion" });
      return;
    }
    if (!userUid) {
      res.status(403).json({ error: "User not signed in" });
      return;
    }
    const discussion = discussions.find((d) => d.id === id);
    if (!discussion) {
      res.status(404).json({ error: "Discussion not found" });
      return;
    }
    if (discussion.userId !== userUid) {
      res.status(403).json({ error: "Unauthorized: You can only delete your own posts" });
      return;
    }

    discussion.title = title;
    discussion.content = content;

    res.status(200).json({ message: "Discussion updated successfully", discussion });
  } catch (error) {
    console.error("Error editing discussion:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Delete a discussion post
export const deleteDiscussion = (req: AuthenticatedRequest, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    const index = discussions.findIndex((discussion) => discussion.id === id);
    const { userUid } = req.body as { userUid: string };

    if (index === -1) {
      res.status(404).json({ error: "Discussion not found" });
      return;
    }
    if (!userUid) {
      res.status(403).json({ error: "User not signed in" });
      return;
    }
    const discussion = discussions[index];
    if (discussion.userId !== userUid) {
      res.status(403).json({ error: "Unauthorized: You can only delete your own posts" });
      return;
    }

    discussions.splice(index, 1);
    res.status(200).json({ message: "Discussion deleted successfully" });
  } catch (error) {
    console.error("Error deleting discussion:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Delete multiple discussion posts
export const deleteMultipleDiscussions = (req: Request, res: Response) => {
  try {
    const { ids, userUid } = req.body as { ids: number[]; userUid: string };

    if (!Array.isArray(ids) || ids.length === 0) {
      res.status(400).json({ error: "Please provide an array of discussion IDs to delete" });
      return;
    }
    if (!userUid) {
      res.status(403).json({ error: "User not signed in" });
    }

    const initialLength = discussions.length;

    for (const id of ids) {
      const index = discussions.findIndex((discussion) => discussion.id === id);
      if (index !== -1) {
        const discussion = discussions[index];
        if (discussion.userId !== userUid) {
          continue;
        }
        discussions.splice(index, 1);
      }
    }

    const finalLength = discussions.length;

    res.status(200).json({
      message: `${(initialLength - finalLength).toString()} discussion(s) deleted successfully`,
      remainingDiscussions: discussions,
    });
  } catch (error) {
    console.error("Error deleting multiple discussions:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get multiple discussion posts
export const getMultipleDiscussions = (_req: Request, res: Response) => {
  try {
    res.status(200).json({ discussions });
  } catch (error) {
    console.error("Error getting discussions:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get an individual discussion post
export const getDiscussion = (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    const discussion = discussions.find((d) => d.id === id);

    if (!discussion) {
      res.status(404).json({ error: "Discussion not found" });
      return;
    }

    res.status(200).json({ discussion });
  } catch (error) {
    console.error("Error getting discussion:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
