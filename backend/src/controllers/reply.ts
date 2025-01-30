import { Request, Response } from 'express';

// Temporary storage until database is set up
const replies: any[] = [];

export const createReply = async (req: Request, res: Response) => {
  try {
    const { discussionId, content } = req.body;

    if (!discussionId || !content) {
      res.status(400).json({ error: 'discussionId and content are required' });
      return;
    }

    const newReply = {
      id: replies.length + 1,
      discussionId: parseInt(discussionId, 10),
      content,
    };

    replies.push(newReply);
    res.status(201).json({ message: 'Reply created successfully', reply: newReply });
  } catch (error) {
    console.error('Error creating reply:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getReplies = async (req: Request, res: Response) => {
  try {
    const { discussionId } = req.params; 

    if (!discussionId) {
      res.status(400).json({ error: 'Discussion ID is required' });
      return;
    }

    const discussionReplies = replies.filter(reply => reply.discussionId === parseInt(discussionId, 10));

    res.status(200).json({ replies: discussionReplies });
  } catch (error) {
    console.error('Error fetching replies:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const editReply = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { content } = req.body;

    if (!content) {
      res.status(400).json({ error: 'Content is required to update reply' });
      return;
    }

    const replyIndex = replies.findIndex(reply => reply.id === parseInt(id, 10));
    if (replyIndex === -1) {
      res.status(404).json({ error: 'Reply not found' });
      return;
    }

    replies[replyIndex].content = content;
    res.status(200).json({ message: 'Reply updated successfully', reply: replies[replyIndex] });
  } catch (error) {
    console.error('Error editing reply:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const deleteReply = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const replyIndex = replies.findIndex(reply => reply.id === parseInt(id, 10));
    if (replyIndex === -1) {
      res.status(404).json({ error: 'Reply not found' });
      return;
    }

    replies.splice(replyIndex, 1);
    res.status(200).json({ message: 'Reply deleted successfully' });
  } catch (error) {
    console.error('Error deleting reply:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
