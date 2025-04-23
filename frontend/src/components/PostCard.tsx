"use client";

import React from "react";

import "./PostCard.css";
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

const PostCard: React.FC<PostCard> = ({
  profileImage,
  authorName,
  date,
  time,
  title,
  audience,
  message,
  onClick = () => {},
}) => {
  return (
    <div className="postcard-container" onClick={onClick}>
      {/* LEFT SIDE: Profile Image + Author Info + Timestamp */}
      <div className="postcard-left">
        <ProfilePicture size="small" letter={authorName[0]} />
        <div className="postcard-author-info">
          <div className="postcard-author-name">{authorName}</div>
          <div className="postcard-timestamp">
            {date}
            {time ? `, ${time}` : ""}
          </div>
        </div>
      </div>

      {/* DIVIDER */}
      <div className="postcard-divider" />

      {/* RIGHT SIDE: Title, Audience, and Message */}
      <div className="postcard-right">
        <div className="postcard-title">{title}</div>
        {audience && <div className="postcard-audience">{audience}</div>}
        <div className="postcard-message">{message}</div>
      </div>
    </div>
  );
};

export default PostCard;
