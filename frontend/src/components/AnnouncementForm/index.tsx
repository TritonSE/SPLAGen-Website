"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";

import styles from "./styles.module.css";

import { Announcement, createAnnouncement, updateAnnouncement } from "@/api/announcement";
import { UserContext } from "@/contexts/userContext";

// Schema
const announcementSchema = z.object({
  title: z.string().min(1).max(50),
  message: z.string().min(1).max(500),
  recipientType: z.enum(["everyone", "language", "specific", ""]),
  language: z.enum(["english", "spanish", "portuguese", "other", ""]),
  recipients: z.string().optional(),
});
type NewAnnouncementData = z.infer<typeof announcementSchema>;

export const AnnouncementForm = ({ announcement }: { announcement?: Announcement }) => {
  const { firebaseUser } = useContext(UserContext);
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<NewAnnouncementData>({ resolver: zodResolver(announcementSchema) });
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (announcement) {
      const firstRecipient = announcement.recipients[0];
      let recipientType: "everyone" | "language" | "specific" = "specific";
      let language: "english" | "spanish" | "portuguese" | "other" | "" = "";
      let recipients = "";

      if (firstRecipient === "everyone") {
        recipientType = "everyone";
      } else if (firstRecipient?.startsWith("language:")) {
        recipientType = "language";
        language = firstRecipient.substring("language:".length) as
          | "english"
          | "spanish"
          | "portuguese"
          | "other";
      } else {
        recipientType = "specific";
        recipients = announcement.recipients.join(",");
      }

      reset({
        recipientType,
        language,
        recipients,
        title: announcement.title,
        message: announcement.message,
      });
    } else {
      reset({
        recipientType: "",
        language: "",
        recipients: "",
        title: "",
        message: "",
      });
    }
  }, [announcement, reset]);

  const onSubmit = useCallback<SubmitHandler<NewAnnouncementData>>(
    async (data) => {
      if (!firebaseUser) return;
      setErrorMessage("");
      setLoading(true);
      try {
        const token = await firebaseUser.getIdToken();

        let recipients: string[] = [];
        if (data.recipientType === "everyone") {
          recipients = ["everyone"];
        } else if (data.recipientType === "language") {
          recipients = [`language:${data.language ?? "english"}`];
        } else {
          // specific emails
          recipients = (data.recipients ?? "")
            .split(",")
            .map((recipient) => recipient.trim())
            .filter(Boolean);
        }

        const formattedData = {
          recipients,
          title: data.title,
          message: data.message,
        };

        if (announcement) {
          const result = await updateAnnouncement(token, announcement._id, formattedData);
          if (result.success && result.data._id) {
            router.push(`/announcements/${result.data._id}`);
          } else {
            setErrorMessage(
              `Failed to update announcement: ${result.success ? JSON.stringify(result.data) : result.error}`,
            );
          }
        } else {
          const result = await createAnnouncement(formattedData, token);
          if (result.success && result.data._id) {
            router.push(`/announcements/${result.data._id}`);
          } else {
            setErrorMessage(
              `Failed to create announcement: ${result.success ? JSON.stringify(result.data) : result.error}`,
            );
          }
        }
      } catch (error) {
        setErrorMessage(
          `Failed to ${announcement ? "update" : "create"} announcement: ${String(error)}`,
        );
      } finally {
        setLoading(false);
      }
    },
    [router, firebaseUser, announcement],
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
        <h1 className={styles.title}>Announcements</h1>
      </div>
      <div className={styles.postPageDiv}>
        <h2 className={styles.pageTitle}>Create New Announcement</h2>
        <form onSubmit={handleFormSubmit} className={styles.createPostForm}>
          <div className={styles.formGroup}>
            <label className={styles.fieldLabel} htmlFor="recipient">
              Recipient
            </label>

            {/* Radio buttons for recipient type */}
            <div className={styles.radioGroup}>
              <label className={styles.radioLabel}>
                <input
                  type="radio"
                  value="everyone"
                  {...register("recipientType")}
                  className={styles.radioInput}
                />
                <span>Everyone</span>
              </label>

              <label className={styles.radioLabel}>
                <input
                  type="radio"
                  value="language"
                  {...register("recipientType")}
                  className={styles.radioInput}
                />
                <span>Specific language only</span>
              </label>

              <label className={styles.radioLabel}>
                <input
                  type="radio"
                  value="specific"
                  {...register("recipientType")}
                  className={styles.radioInput}
                />
                <span>Specific users only</span>
              </label>
            </div>

            {/* Language selection - shown when "language" is selected */}
            {watch("recipientType") === "language" && (
              <div className={styles.languageGroup}>
                <label className={styles.radioLabel}>
                  <input
                    type="radio"
                    value="english"
                    {...register("language")}
                    className={styles.radioInput}
                  />
                  <span>English</span>
                </label>

                <label className={styles.radioLabel}>
                  <input
                    type="radio"
                    value="spanish"
                    {...register("language")}
                    className={styles.radioInput}
                  />
                  <span>Spanish</span>
                </label>

                <label className={styles.radioLabel}>
                  <input
                    type="radio"
                    value="portuguese"
                    {...register("language")}
                    className={styles.radioInput}
                  />
                  <span>Portuguese</span>
                </label>

                <label className={styles.radioLabel}>
                  <input
                    type="radio"
                    value="other"
                    {...register("language")}
                    className={styles.radioInput}
                  />
                  <span>Other</span>
                </label>
              </div>
            )}

            {/* Email input - shown when "specific" is selected */}
            {watch("recipientType") === "specific" && (
              <input
                id="post-recipient"
                type="text"
                className={styles.inputField}
                {...register("recipients")}
                placeholder="Enter email(s) separated by commas"
              />
            )}
            <p className="error-message">{errors.recipients?.message ?? "\u00A0"}</p>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.fieldLabel} htmlFor="title">
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
                router.back();
              }}
              disabled={loading}
            >
              Cancel
            </button>
            <button className={styles.buttonPost} type="submit" disabled={loading}>
              {loading ? "Loading..." : announcement ? "Save" : "Post"}
            </button>
          </div>
          {errorMessage && <div className="text-red-500">{errorMessage}</div>}
        </form>
      </div>
    </div>
  );
};
