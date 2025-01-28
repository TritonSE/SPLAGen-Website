import { Request, Response } from 'express';

// Temporary storage for discussion posts
const discussions: any[] = [];

// Create a discussion post
export const createDiscussion = async (req: Request, res: Response) => {
  try {
    const discussionData = req.body;
    const newDiscussion = { id: discussions.length + 1, ...discussionData, replies: [] };
    discussions.push(newDiscussion);
    return res.status(201).json({ message: 'Discussion created successfully', discussion: newDiscussion });
  } catch (error) {
    console.error('Error creating discussion:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// Edit a discussion post
export const editDiscussion = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, content } = req.body;

    if (!title || !content) {
      return res.status(400).json({ error: 'Title and content are required to update discussion' });
    }

    const discussionIndex = discussions.findIndex(discussion => discussion.id === parseInt(id, 10));
    if (discussionIndex === -1) {
      return res.status(404).json({ error: 'Discussion not found' });
    }

    discussions[discussionIndex].title = title;
    discussions[discussionIndex].content = content;

    return res.status(200).json({ message: 'Discussion updated successfully', discussion: discussions[discussionIndex] });
  } catch (error) {
    console.error('Error editing discussion:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// Delete a discussion post
export const deleteDiscussion = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const index = discussions.findIndex(discussion => discussion.id === parseInt(id));
    if (index === -1) {
      return res.status(404).json({ error: 'Discussion not found' });
    }
    discussions.splice(index, 1);
    return res.status(200).json({ message: 'Discussion deleted successfully' });
  } catch (error) {
    console.error('Error deleting discussion:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// Delete multiple discussion posts
export const deleteMultipleDiscussions = async (req: Request, res: Response) => {
  try {
    const { ids } = req.body; 
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ error: 'Please provide an array of discussion IDs to delete' });
    }

    const initialLength = discussions.length;

    for (const id of ids) {
      const index = discussions.findIndex(discussion => discussion.id === id);
      if (index !== -1) {
        discussions.splice(index, 1);
      }
    }

    const finalLength = discussions.length;

    return res.status(200).json({
      message: `${initialLength - finalLength} discussion(s) deleted successfully`,
      remainingDiscussions: discussions,
    });
  } catch (error) {
    console.error('Error deleting multiple discussions:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// Get multiple discussion posts
export const getMultipleDiscussions = async (_req: Request, res: Response) => {
  try {
    return res.status(200).json({ discussions });
  } catch (error) {
    console.error('Error getting discussions:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// Get an individual discussion post
export const getDiscussion = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const discussion = discussions.find(d => d.id === parseInt(id));
    if (!discussion) {
      return res.status(404).json({ error: 'Discussion not found' });
    }
    return res.status(200).json({ discussion });
  } catch (error) {
    console.error('Error getting discussion:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
