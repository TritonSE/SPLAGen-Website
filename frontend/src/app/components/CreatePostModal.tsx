/* eslint-disable @typescript-eslint/no-unsafe-call */
import React, { useState } from "react";
import { z } from "zod";
import "./CreatePostModal.css";

// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
const postSchema = z.object({
  title: z
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    .string()
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    .min(3, "Title must be at least 3 characters")
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    .max(50, "Title must be at most 50 characters"),
  message: z
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    .string()
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    .min(5, "Message must be at least 5 characters")
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    .max(500, "Message must be at most 500 characters"),
});

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { title: string; message: string }) => void;
}

const CreatePostModal: React.FC<CreatePostModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [title, setTitle] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [errors, setErrors] = useState<{ title?: string; message?: string }>({});

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const result = postSchema.safeParse({ title, message });
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (!result.success) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      const errorMessages = result.error.format();
      setErrors({
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        title: errorMessages.title?._errors[0],
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        message: errorMessages.message?._errors[0],
      });
      return;
    }

    setErrors({});

    onSubmit({ title, message });
    setTitle("");
    setMessage("");
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <h2>Create New Post</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="post-title">Post Title</label>
            <input
              id="post-title"
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
              }}
              placeholder="Post title name"
              required
            />
            {errors.title && <p className="error-message">{errors.title}</p>}
          </div>
          <div className="form-group">
            <label htmlFor="post-message">Message</label>
            <textarea
              id="post-message"
              value={message}
              onChange={(e) => {
                setMessage(e.target.value);
              }}
              placeholder="Message"
              required
            />
            {errors.message && <p className="error-message">{errors.message}</p>}
          </div>
          <div className="modal-actions">
            <button type="button" onClick={onClose}>
              Cancel
            </button>
            <button type="submit">Submit</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePostModal;
