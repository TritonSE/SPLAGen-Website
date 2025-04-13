"use client";

import React, { useState } from "react";

import {
  ApproveDirectoryRequestPopup,
  DenyDirectoryRequestPopup,
  InviteAdminPopup,
  RemoveAdminPopup,
} from "@/components";

export default function FlowPopupDemo() {
  const [isOpenDeny, setIsOpenDeny] = useState(false);
  const [isOpenApprove, setIsOpenApprove] = useState(false);
  const [isOpenInvite, setIsOpenInvite] = useState(false);
  const [isOpenRemove, setIsOpenRemove] = useState(false);

  return (
    <div className="flex flex-col gap-4">
      <h1>Popup Demo</h1>

      <button
        onClick={() => {
          setIsOpenDeny(!isOpenDeny);
        }}
        className="px-4 py-2 bg-red-500 text-white rounded"
      >
        Show Deny Request Popup
      </button>
      <DenyDirectoryRequestPopup
        isOpen={isOpenDeny}
        user={{ name: "name", email: "email", userId: "userId" }}
        onCancel={() => {
          console.log("Cancelled Deny");
          setIsOpenDeny(false);
        }}
      />
      <button
        onClick={() => {
          setIsOpenApprove(!isOpenApprove);
        }}
        className="px-4 py-2 bg-green-500 text-white rounded"
      >
        Show Approve Request Popup
      </button>
      <ApproveDirectoryRequestPopup
        isOpen={isOpenApprove}
        user={{ name: "name", userId: "userId" }}
        onCancel={() => {
          console.log("Cancelled Approve");
          setIsOpenApprove(false);
        }}
      />
      <button
        onClick={() => {
          setIsOpenInvite(!isOpenInvite);
        }}
        className="px-4 py-2 bg-blue-500 text-white rounded"
      >
        Show Invite Admin Popup
      </button>
      <InviteAdminPopup
        isOpen={isOpenInvite}
        user={{ name: "name", userId: "userId" }}
        onCancel={() => {
          console.log("Cancelled Invite");
          setIsOpenInvite(false);
        }}
      />
      <button
        onClick={() => {
          setIsOpenRemove(!isOpenRemove);
        }}
        className="px-4 py-2 bg-yellow-500 text-black rounded"
      >
        Show Remove Admin Popup
      </button>
      <RemoveAdminPopup
        isOpen={isOpenRemove}
        user={{ name: "name", email: "email", userId: "userId" }}
        onCancel={() => {
          console.log("Cancelled Remove");
          setIsOpenRemove(false);
        }}
      />
    </div>
  );
}
