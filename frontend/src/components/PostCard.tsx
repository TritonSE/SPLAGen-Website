"use client";

import React from "react";

import styles from "./PostCard.module.css";

import { ProfilePicture } from "@/components/ProfilePicture";

type PostCard = {
  profileImage?: string;
  authorName: string;
  date: string;
  time?: string;
  title: string;
  audience?: string;
  message: string;
  onClick?: () => void;
};

export const PostCard: React.FC<PostCard> = ({
  authorName,
  date,
  time,
  title,
  audience,
  message,
  onClick,
}) => {
  return (
    <div className={styles["postcard-container"]} onClick={onClick}>
      <div className={styles["postcard-left"]}>
        <ProfilePicture size="small" letter={authorName[0]} />
        <div className={styles["postcard-author-info"]}>
          <div className={styles["postcard-author-name"]}>{authorName}</div>
          <div className={styles["postcard-timestamp"]}>
            {date}
            {time ? `, ${time}` : ""}
          </div>
        </div>
      </div>

      <div className={styles["postcard-divider"]} />

      <div className={styles["postcard-right"]}>
        <div className={styles["postcard-title"]}>{title}</div>
        {audience && <div className={styles["postcard-audience"]}>{audience}</div>}
        <div className={styles["postcard-message"]}>{message}</div>
      </div>
    </div>
  );
};
