"use client";

import React from "react";

type PostCard = {
  profileImage: string;
  authorName: string;
  date: string;
  time: string;
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
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onClick = () => {},
}) => {
  return (
    <div
      className="bg-white border rounded-[10px] py-5 px-10 flex items-stretch justify-between cursor-pointer"
      onClick={onClick}
    >
      {/* LEFT SIDE: Profile Image + Author Name + Timestamp */}
      <div className="flex items-center gap-[16.89px]">
        <img
          src={profileImage}
          alt={`${authorName}'s profile`}
          className="w-[51.6px] h-[51.6px]"
          style={{
            objectFit: "cover",
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
            borderRadius: "281.44px",
          }}
        />

        {/* Author + Timestamp in another flex box */}
        <div className="flex flex-col gap-[5px]">
          <div className="text-base font-normal text-black leading-normal">{authorName}</div>
          <div className="text-[12px] font-normal text-black leading-normal">
            {date}, {time}
          </div>
        </div>
      </div>

      {/* DIVIDER LINE */}
      <div className="w-[1px] bg-gray-300 mx-[29px]" />

      {/* RIGHT SIDE Content */}
      <div className="flex flex-col justify-center" style={{ width: "747px" }}>
        {/* Title */}
        <div
          className="text-black font-bold leading-[27px] tracking-[0.36px]"
          style={{
            fontFamily: '"DM Sans"',
            fontSize: "18px",
            lineHeight: "150%",
            letterSpacing: "0.36px",
          }}
        >
          {title}
        </div>

        {/* Audience */}
        <div
          className="text-black"
          style={{
            fontFamily: '"DM Sans"',
            fontSize: "14px",
            fontWeight: 400,
            lineHeight: "20px",
          }}
        >
          {audience}
        </div>

        {/* Message */}
        <div
          style={{
            color: "#6C6C6C",
            fontFamily: '"DM Sans"',
            fontSize: "12px",
            fontWeight: 400,
            lineHeight: "22px",
          }}
        >
          {message}
        </div>
      </div>
    </div>
  );
};

export default PostCard;
