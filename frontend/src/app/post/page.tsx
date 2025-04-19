/* eslint-disable @typescript-eslint/no-misused-promises */
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
  } = useForm<PostFormData>({
    resolver: zodResolver(postSchema),
  });

  const onSubmit = useCallback<SubmitHandler<PostFormData>>(
    async (data) => {
      try {
        await createPost(data); // Ensure this function exists & is imported
        reset();
        router.push("/discussion");
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

  return (
    <div className={styles.createPostPageContainer}>
      <div className={styles.postPageDiv}>
        <h1 className={styles.pageTitle}>Create New Post</h1>
        <form onSubmit={handleSubmit(onSubmit)} className={styles.createPostForm}>
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
              Post
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePostPage;
