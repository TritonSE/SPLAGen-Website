"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import React, { useCallback } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";

import styles from "./post.module.css";

import { createPost } from "@/api/discussion";

// Schema
const postSchema = z.object({
  title: z.string().min(3).max(50),
  message: z.string().min(5).max(500),
});
type PostFormData = z.infer<typeof postSchema>;

const CreatePostPage: React.FC = () => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<PostFormData>({ resolver: zodResolver(postSchema) });

  const onSubmit = useCallback<SubmitHandler<PostFormData>>(
    async (data) => {
      try {
        const result = await createPost(data);

        if (result.success && result.data._id) {
          reset();
          router.push(`/discussion/${result.data._id}`);
        } else {
          console.error("Post creation failed: Unexpected result structure");
        }
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.error("Failed to submit post:", error.message);
        } else {
          console.error("Unknown error:", error);
        }
      }
    },
    [reset, router],
  );

  const handleFormSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      void handleSubmit(onSubmit)();
    },
    [handleSubmit, onSubmit],
  );

  return (
    <div className={styles.createPostPageContainer}>
      <div className={styles.titleBackDiv}>
        <h1 className={styles.title}>Discussion</h1>
      </div>
      <div className={styles.postPageDiv}>
        <h2 className={styles.pageTitle}>Create New Post</h2>
        <form onSubmit={handleFormSubmit} className={styles.createPostForm}>
          <div className={styles.formGroup}>
            <label htmlFor="post-title">Post Title</label>
            <input
              id="post-title"
              type="text"
              className={styles.inputField}
              {...register("title")}
              placeholder="Title"
            />
            <p className="error-message">{errors.title?.message ?? "\u00A0"}</p>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="post-message">Message</label>
            <textarea
              id="post-message"
              className={styles.textAreaField}
              {...register("message")}
              placeholder="Your message"
            />
            <p className="error-message">{errors.message?.message ?? "\u00A0"}</p>
          </div>

          <div className={styles.formActions}>
            <button
              className={styles.buttonCancel}
              type="button"
              onClick={() => {
                router.push("/discussion");
              }}
            >
              Cancel
            </button>
            <button className={styles.buttonPost} type="submit">
              Post Discussion
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePostPage;
