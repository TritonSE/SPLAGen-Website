"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Checkbox } from "@tritonse/tse-constellation";
import { useRouter } from "next/navigation";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";

import styles from "./styles.module.css";

import { Announcement, createAnnouncement, updateAnnouncement } from "@/api/announcement";
import { UserContext } from "@/contexts/userContext";

// Schema
const announcementSchema = z.object({
  title: z.string().min(1).max(50),
  message: z.string().min(1).max(500),
  allRecipients: z.boolean(),
  recipients: z.string().optional(),
});
type NewAnnouncementData = z.infer<typeof announcementSchema>;

export const AnnouncementForm = ({ announcement }: { announcement?: Announcement }) => {
  const { firebaseUser } = useContext(UserContext);
  const router = useRouter();
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<NewAnnouncementData>({ resolver: zodResolver(announcementSchema) });
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (announcement) {
      reset({
        allRecipients: announcement.recipients[0] === "everyone",
        recipients:
          announcement.recipients[0] === "everyone" ? "" : announcement.recipients.join(","),
        title: announcement.title,
        message: announcement.message,
      });
    }
  }, [announcement, reset]);

  const onSubmit = useCallback<SubmitHandler<NewAnnouncementData>>(
    async (data) => {
      if (!firebaseUser) return;
      try {
        setErrorMessage("");
        const token = await firebaseUser.getIdToken();

        const formattedData = {
          recipients: data.allRecipients
            ? ["everyone"]
            : (data.recipients ?? "").split(",").map((recipient) => recipient.trim()),
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
            <div className="flex flex-row">
              <Controller
                name="allRecipients"
                control={control}
                render={({ field }) => (
                  <Checkbox
                    id="all-recipients"
                    checked={field.value}
                    onChange={(checked) => {
                      field.onChange(checked);
                      if (checked) {
                        setValue("recipients", "");
                      }
                    }}
                  />
                )}
              />

              <p>Everyone</p>
            </div>
            <input
              id="post-recipient"
              type="text"
              className={styles.inputField}
              disabled={watch("allRecipients")}
              {...register("recipients")}
              placeholder="Enter email(s) separated by commas"
            />
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
            >
              Cancel
            </button>
            <button className={styles.buttonPost} type="submit">
              {announcement ? "Save" : "Post"}
            </button>
          </div>
          {errorMessage && <div className="text-red-500">{errorMessage}</div>}
        </form>
      </div>
    </div>
  );
};
