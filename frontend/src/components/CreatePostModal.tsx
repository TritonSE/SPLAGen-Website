/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import "./CreatePostModal.css";

// Define validation schema using Zod
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

// Define form data type based on schema
type PostFormData = z.infer<typeof postSchema>;

type CreatePostModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: PostFormData) => void;
};

const CreatePostModal: React.FC<CreatePostModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<PostFormData>({
    resolver: zodResolver(postSchema),
  });

  if (!isOpen) return null;

  const submitForm = (data: PostFormData) => {
    onSubmit(data);
    reset(); // Reset form after submission
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <h2>Create New Post</h2>
        <form onSubmit={handleSubmit(submitForm)}>
          <div className="form-group">
            <label htmlFor="post-title">Post Title</label>
            <input
              id="post-title"
              type="text"
              {...register("title")}
              placeholder="Post title name"
            />
            {errors.title && <p className="error-message">{errors.title.message}</p>}
          </div>
          <div className="form-group">
            <label htmlFor="post-message">Message</label>
            <textarea id="post-message" {...register("message")} placeholder="Message" />
            {errors.message && <p className="error-message">{errors.message.message}</p>}
          </div>
          <div className="modal-actions">
            <button type="button" onClick={onClose}>
              Cancel
            </button>
            <button type="submit">Post</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePostModal;
