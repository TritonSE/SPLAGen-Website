import React, { useState } from "react";
import { z } from "zod";
import "./CreatePostModal.css";

const postSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(50, "Title must be at most 50 characters"),
  message: z
    .string()
    .min(5, "Message must be at least 5 characters")
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

    const result = postSchema.safeParse({ title, message });
    if (!result.success) {
      const errorMessages = result.error.format();
      setErrors({
        title: errorMessages.title?._errors[0],
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
