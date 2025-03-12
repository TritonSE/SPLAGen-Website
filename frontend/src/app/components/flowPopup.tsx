"use client";

import React, { ReactNode, useState } from "react";

// Define the username style constant
const usernameStyle = {
  color: "#000",
  fontFamily: "'DM Sans', sans-serif",
  fontSize: "25px",
  fontWeight: "700",
  lineHeight: "normal",
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
  display: "inline",
  verticalAlign: "middle",
};

// Custom Button Component
const Button = ({
  children,
  variant,
  onClick,
}: {
  children: ReactNode;
  variant?: string;
  onClick: () => void;
}) => (
  <button
    onClick={onClick}
    className={`flex justify-center items-center gap-2 px-[19px] py-[12px] h-[46px] rounded-[10px] ${
      variant === "cancel"
        ? "border border-black text-black font-dm-sans text-[17px] font-normal leading-normal hover:bg-gray-200"
        : variant === "confirm"
          ? "bg-[#3B3B62] text-white font-dm-sans text-[17px] font-normal leading-normal hover:bg-[#2e2e56]"
          : ""
    }`}
  >
    {children}
  </button>
);

const Card = ({ children }: { children: ReactNode }) => (
  <div className="flex flex-col items-center gap-4 p-10 w-[500px] bg-white shadow-lg rounded-[10px]">
    {children}
  </div>
);

const SVGIcon = ({
  path,
  size = 80,
  fill = "#FFBC44",
}: {
  path: string;
  size?: number;
  fill?: string;
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 80 80"
    fill="none"
  >
    <path d={path} fill={fill} />
  </svg>
);

// Base Popup Component
const BasePopup = ({
  icon,
  title,
  message,
  notePlaceholder,
  noteTo,
  onCancel,
  onConfirm,
  confirmText,
  cancelText,
}: {
  icon: ReactNode;
  title: string;
  message: string;
  notePlaceholder?: string;
  noteTo?: string;
  onCancel: () => void;
  onConfirm: () => void;
  confirmText: string;
  cancelText: string;
}) => {
  // Managing the input visibility
  const [note, setNote] = useState<string>("");

  return (
    <Card>
      <div className="flex flex-col items-center gap-4 w-[500px] p-10 rounded-[10px] bg-white">
        <div className="flex justify-center items-center w-[80px] h-[80px]">{icon}</div>
        <h2 className="text-black text-center font-dm-sans text-[25px] font-medium w-[401px] leading-normal mb-4">
          {title}
        </h2>
        <p className="text-black text-center font-dm-sans text-[16px] font-normal leading-normal w-full mb-6">
          {message}
        </p>

        {noteTo && (
          <>
            <p className="text-black text-left font-dm-sans text-[16px] w-[400px] font-normal leading-normal w-full mb-2.5 self-stretch">
              Send a note to: {noteTo}
            </p>

            <input
              type="text"
              value={note}
              onChange={(e) => {
                setNote(e.target.value);
              }}
              placeholder={notePlaceholder}
              className="w-full h-[89.119px] py-[10.238px] px-[247.49px] pb-[57.881px] pl-[12.51px] border border-[rgba(0,0,0,0.40)] rounded-[5px] bg-white"
            />
          </>
        )}
      </div>
      <div className="flex justify-end gap-10">
        <Button variant="cancel" onClick={onCancel}>
          {cancelText}
        </Button>
        <Button variant="confirm" onClick={onConfirm}>
          {confirmText}
        </Button>
      </div>
    </Card>
  );
};

// Specific Popups
export const DenyRequestPopup = ({
  user,
  onCancel,
  onConfirm,
}: {
  user: { name: string; email: string };
  onCancel: () => void;
  onConfirm: () => void;
}) => (
  <BasePopup
    icon={
      <SVGIcon path="M14.9002 70.0003H65.1003C70.2336 70.0003 73.4336 64.4336 70.8669 60.0003L45.7669 16.6336C43.2002 12.2003 36.8002 12.2003 34.2336 16.6336L9.13357 60.0003C6.56691 64.4336 9.76691 70.0003 14.9002 70.0003ZM40.0002 46.6669C38.1669 46.6669 36.6669 45.1669 36.6669 43.3336V36.6669C36.6669 34.8336 38.1669 33.3336 40.0002 33.3336C41.8336 33.3336 43.3336 34.8336 43.3336 36.6669V43.3336C43.3336 45.1669 41.8336 46.6669 40.0002 46.6669ZM43.3336 60.0003H36.6669V53.3336H43.3336V60.0003Z" />
    }
    title={
      <>
        Are you sure you want to deny <span style={usernameStyle}>{user.name}</span>’s request?
      </>
    }
    message="This action is irreversible. They will remain part of the counselor database but will not appear in the directory. To be added, they will need to submit a new request."
    notePlaceholder="Let them know why"
    noteTo={user.email}
    cancelText="Cancel"
    confirmText="Deny Request"
    onCancel={onCancel}
    onConfirm={onConfirm}
  />
);

export const ApproveRequestPopup = ({
  user,
  onCancel,
  onConfirm,
}: {
  user: { name: string };
  onCancel: () => void;
  onConfirm: () => void;
}) => (
  <BasePopup
    icon={
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="58"
        height="58"
        viewBox="0 0 58 58"
        fill="none"
      >
        <rect width="58" height="58" rx="10" fill="#44ACD5" />
        <path
          d="M30.864 26.5081L30.864 26.5081L30.8623 26.5093L30.8398 26.5248C29.9966 27.106 28.8844 27.8725 28.0187 28.9435L28.0186 28.9436C26.9796 30.23 26.35 31.8529 26.35 34V34.9565C26.35 35.5296 26.5761 36.0796 26.9791 36.4854C27.3822 36.8913 27.9292 37.1196 28.5 37.1196C29.0708 37.1196 29.6178 36.8913 30.0209 36.4854C30.4239 36.0796 30.65 35.5296 30.65 34.9565V34C30.65 32.8002 30.9699 32.152 31.3545 31.672C31.8156 31.105 32.4394 30.6705 33.4188 29.9931L33.4204 29.992L33.5193 29.9224C33.5196 29.9222 33.5199 29.9221 33.5202 29.9219C34.4622 29.2717 35.7057 28.3972 36.6588 27.0535C37.6676 25.6436 38.25 23.8733 38.25 21.5652C38.25 18.9626 37.2232 16.4663 35.3949 14.6254C33.5665 12.7845 31.0864 11.75 28.5 11.75C25.9136 11.75 23.4335 12.7845 21.6051 14.6254C19.7768 16.4663 18.75 18.9626 18.75 21.5652C18.75 22.1383 18.9761 22.6883 19.3791 23.0941C19.7822 23.5 20.3292 23.7283 20.9 23.7283C21.4708 23.7283 22.0178 23.5 22.4209 23.0941C22.8239 22.6883 23.05 22.1383 23.05 21.5652C23.05 18.5298 25.4895 16.0761 28.5 16.0761C31.5105 16.0761 33.95 18.5298 33.95 21.5652C33.95 23.0801 33.5849 23.9426 33.1641 24.5366C32.6948 25.1949 32.0398 25.6952 31.0832 26.3597L30.864 26.5081ZM28.5 45.25C29.1967 45.25 29.8646 44.9713 30.3568 44.4758C30.8489 43.9803 31.125 43.3087 31.125 42.6087C31.125 41.9087 30.8489 41.2371 30.3568 40.7416C29.8646 40.2461 29.1967 39.9674 28.5 39.9674C27.8033 39.9674 27.1354 40.2461 26.6432 40.7416C26.1511 41.2371 25.875 41.9087 25.875 42.6087C25.875 43.3087 26.1511 43.9803 26.6432 44.4758C27.1354 44.9713 27.8033 45.25 28.5 45.25Z"
          fill="white"
          stroke="white"
          stroke-width="0.5"
        />
      </svg>
    }
    title={
      <>
        Approve <span style={usernameStyle}>{user.name}</span>’s request to be part of the
        directory?
      </>
    }
    message="The counselor will be approved and added to the directory. Any future updates will require manual review."
    cancelText="Cancel"
    confirmText="Approve Request"
    onCancel={onCancel}
    onConfirm={onConfirm}
  />
);

export const InviteAdminPopup = ({
  user,
  onCancel,
  onConfirm,
}: {
  user: { name: string };
  onCancel: () => void;
  onConfirm: () => void;
}) => (
  <BasePopup
    icon={
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="80"
        height="80"
        viewBox="0 0 80 80"
        fill="none"
      >
        <circle cx="40.0002" cy="39.9997" r="26.6667" fill="#0C2B35" />
        <path
          d="M39.9998 29.9997C41.8408 29.9997 43.3332 28.5073 43.3332 26.6663C43.3332 24.8254 41.8408 23.333 39.9998 23.333C38.1589 23.333 36.6665 24.8254 36.6665 26.6663C36.6665 28.5073 38.1589 29.9997 39.9998 29.9997Z"
          fill="white"
        />
        <path
          d="M42.4998 34.9997C42.4998 33.619 41.3805 32.4997 39.9998 32.4997C38.6191 32.4997 37.4998 33.619 37.4998 34.9997V53.333C37.4998 54.7137 38.6191 55.833 39.9998 55.833C41.3805 55.833 42.4998 54.7137 42.4998 53.333V34.9997Z"
          fill="white"
        />
      </svg>
    }
    title={
      <>
        Invite <span style={usernameStyle}>{user.name}</span> to be an admin?
      </>
    }
    message="They will have access to manage counselors, create announcements, and moderate discussions."
    cancelText="Cancel"
    confirmText="Send Invite"
    onCancel={onCancel}
    onConfirm={onConfirm}
  />
);

export const RemoveAdminPopup = ({
  user,
  onCancel,
  onConfirm,
}: {
  user: { name: string; email: string };
  onCancel: () => void;
  onConfirm: () => void;
}) => (
  <BasePopup
    icon={
      <SVGIcon path="M14.9002 70.0003H65.1003C70.2336 70.0003 73.4336 64.4336 70.8669 60.0003L45.7669 16.6336C43.2002 12.2003 36.8002 12.2003 34.2336 16.6336L9.13357 60.0003C6.56691 64.4336 9.76691 70.0003 14.9002 70.0003ZM40.0002 46.6669C38.1669 46.6669 36.6669 45.1669 36.6669 43.3336V36.6669C36.6669 34.8336 38.1669 33.3336 40.0002 33.3336C41.8336 33.3336 43.3336 34.8336 43.3336 36.6669V43.3336C43.3336 45.1669 41.8336 46.6669 40.0002 46.6669ZM43.3336 60.0003H36.6669V53.3336H43.3336V60.0003Z" />
    }
    title={
      <>
        Are you sure you want to remove <span style={usernameStyle}>{user.name}</span> as an admin?
      </>
    }
    message="They will remain as a genetic counselor but will lose all admin privileges. To make them an admin again, you will need to resend an invitation."
    notePlaceholder="Let them know why"
    noteTo={user.email}
    cancelText="Cancel"
    confirmText="Remove Admin"
    onCancel={onCancel}
    onConfirm={onConfirm}
  />
);
