"use client";

import moment from "moment";
import React from "react";

import styles from "./PostCard.module.css";

import { User } from "@/api/users";
import { ProfilePicture } from "@/components/ProfilePicture";

type PostCard = {
  href: string;
  profileImage?: string;
  author: User;
  createdAt: string;
  title: string;
  audience?: string;
  message: string;
  onClick?: () => void;
};

export const PostCard: React.FC<PostCard> = ({
  href,
  author,
  createdAt,
  title,
  audience,
  message,
  onClick,
}) => {
  return (
    <a href={href}>
      <div className={styles["postcard-container"]} onClick={onClick}>
        <div className={styles["postcard-left"]}>
          <ProfilePicture size="small" user={author} />
          <div className={styles["postcard-author-info"]}>
            <div className={styles["postcard-author-name"]}>
              {author.personal.firstName} {author.personal.lastName}
            </div>
            <div className={styles["postcard-timestamp"]}>
              {moment(createdAt).format("MMMM D YYYY")}
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
    </a>
  );
};
