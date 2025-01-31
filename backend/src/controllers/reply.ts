import { Request, Response } from 'express';

// Temporary storage until database is set up
type Reply = {
  id: number;
  discussionId: number;
  content: string;
}

// Temporary storage until database is set up
const replies: Reply[] = [];

export const createReply = (req: Request, res: Response) => {
  try {
    const { discussionId, content } = req.body as { discussionId: string; content: string };

    if (!discussionId || !content) {
      res.status(400).json({ error: 'discussionId and content are required' });
      return;
    }

    const newReply: Reply = {
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

export const getReplies = (req: Request, res: Response) => {
  try {
    const discussionId = parseInt(req.params.discussionId, 10);

    if (isNaN(discussionId)) {
      res.status(400).json({ error: 'Valid Discussion ID is required' });
      return;
    }

    const discussionReplies = replies.filter(reply => reply.discussionId === discussionId);

    res.status(200).json({ replies: discussionReplies });
  } catch (error) {
    console.error('Error fetching replies:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const editReply = (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    const { content } = req.body as { content: string };

    if (!content) {
      res.status(400).json({ error: 'Content is required to update reply' });
      return;
    }

    const reply = replies.find(r => r.id === id);
    if (!reply) {
      res.status(404).json({ error: 'Reply not found' });
      return;
    }

    reply.content = content;
    res.status(200).json({ message: 'Reply updated successfully', reply });
  } catch (error) {
    console.error('Error editing reply:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const deleteReply = (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);

    if (isNaN(id)) {
      res.status(400).json({ error: 'Valid Reply ID is required' });
      return;
    }

    const replyIndex = replies.findIndex(reply => reply.id === id);
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
