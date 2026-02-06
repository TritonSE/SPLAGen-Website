"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";

import styles from "./styles.module.css";

import { Discussion, createPost, updateDiscussion } from "@/api/discussion";
import { UserContext } from "@/contexts/userContext";

// Schema
const postSchema = z.object({
  title: z.string().min(1).max(50),
  message: z.string().min(1).max(500),
});
type PostFormData = z.infer<typeof postSchema>;

export const DiscussionForm = ({ post }: { post?: Discussion }) => {
  const { firebaseUser } = useContext(UserContext);
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<PostFormData>({ resolver: zodResolver(postSchema) });
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (post) {
      reset({
        title: post.title,
        message: post.message,
      });
    }
  }, [post, reset]);

  const onSubmit = useCallback<SubmitHandler<PostFormData>>(
    async (data) => {
      if (!firebaseUser) return;

      setErrorMessage("");
      setLoading(true);
      try {
        const token = await firebaseUser.getIdToken();

        if (post) {
          const result = await updateDiscussion(token, post._id, data);

          if (result.success && result.data._id) {
            reset();
            router.push(`/discussion/${result.data._id}`);
          } else {
            setErrorMessage(
              `Failed to update post: ${result.success ? JSON.stringify(result.data) : result.error}`,
            );
          }
        } else {
          const result = await createPost(data, token);

          if (result.success && result.data._id) {
            reset();
            router.push(`/discussion/${result.data._id}`);
          } else {
            setErrorMessage(
              `Failed to create post: ${result.success ? JSON.stringify(result.data) : result.error}`,
            );
          }
        }
      } catch (error) {
        setErrorMessage(`Failed to ${post ? "update" : "create"} post: ${String(error)}`);
      } finally {
        setLoading(false);
      }
    },
    [post, reset, router, firebaseUser],
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
        <h2 className={styles.pageTitle}>{post ? "Edit" : "Create New"} Post</h2>
        <form onSubmit={handleFormSubmit} className={styles.createPostForm}>
          <div className={styles.formGroup}>
            <label className={styles.fieldLabel} htmlFor="post-title">
              Subject
            </label>
            <input
              id="post-title"
              type="text"
              className={styles.inputField}
              {...register("title")}
              placeholder="Enter subject"
            />
            <p className="error-message">{errors.title?.message ?? "\u00A0"}</p>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.fieldLabel} htmlFor="post-message">
              Message
            </label>
            <textarea
              id="post-message"
              className={styles.textAreaField}
              {...register("message")}
              placeholder="Enter message"
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
              disabled={loading}
            >
              Cancel
            </button>
            <button className={styles.buttonPost} type="submit" disabled={loading}>
              {loading ? "Loading..." : post ? "Save" : "Post Discussion"}
            </button>
          </div>
          {errorMessage && <div className="text-red-500">{errorMessage}</div>}
        </form>
      </div>
    </div>
  );
};
