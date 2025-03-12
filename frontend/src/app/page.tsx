"use client";
import Link from "next/link";
import React, { useContext, useState } from "react";

import { EditBasicInfoModal, External, LanguageSwitcher } from "@/components";
import { UserContext } from "@/contexts/userContext";

export default function Dashboard() {
  const [isModalOpen, setIsModalOpen] = useState(false);

import {
  ApproveRequestPopup,
  DenyRequestPopup,
  InviteAdminPopup,
  RemoveAdminPopup,
} from "./components/flowPopup";

type PopupType = "deny" | "approve" | "invite" | "remove" | null;
  const [activePopup, setActivePopup] = useState<PopupType>(null);

  const user = { name: "Nancy Liu", email: "n6liu@ucsd.edu" };

  const renderPopup = () => {
    switch (activePopup) {
      case "deny":
        return (
          <DenyRequestPopup
            user={user}
            onCancel={() => {
              setActivePopup(null);
            }}
            onConfirm={() => {
              alert("Denied!");
            }}
          />
        );
      case "approve":
        return (
          <ApproveRequestPopup
            user={user}
            onCancel={() => {
              setActivePopup(null);
            }}
            onConfirm={() => {
              alert("Approved!");
            }}
          />
        );
      case "invite":
        return (
          <InviteAdminPopup
            user={user}
            onCancel={() => {
              setActivePopup(null);
            }}
            onConfirm={() => {
              alert("Invited!");
            }}
          />
        );
      case "remove":
        return (
          <RemoveAdminPopup
            user={user}
            onCancel={() => {
              setActivePopup(null);
            }}
            onConfirm={() => {
              alert("Removed!");
            }}
          />
        );
      default:
        return null;
    }
  };
  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const { user } = useContext(UserContext);
  return (
    <div>
      <h1> Dashboard/Home </h1>
      <Link href="/login">go to login</Link>

      <div className="grid grid-rows-[20px_1fr_20px] items-center min-h-screen">
        <main className="flex flex-col gap-8 row-start-2 items-center">
          <Link href="/phoneInputDemo"> Go to phone input demo </Link>
          {/* Added the LanguageSwitcher component */}
          <LanguageSwitcher />
          {/* External is my text component */}
          <External></External>

          {user && (
            <p>
              {user.personal.firstName} {user.role}
            </p>
          )}
        </main>
        <button onClick={handleOpenModal}>Open Post Modal</button>
        {/* <DirectoryInfoModal isOpen={isModalOpen} onClose={handleCloseModal} /> */}
        <EditBasicInfoModal isOpen={isModalOpen} onClose={handleCloseModal} />
        {/* <CreatePostModal isOpen={isModalOpen} onClose={handleCloseModal} /> */}
        {/* <ProfessionalInfoModal isOpen={isModalOpen} onClose={handleCloseModal} /> */}
      </div>
      <h1>Popup Demo</h1>
      <button
        onClick={() => {
          setActivePopup("deny");
        }}
        className="px-4 py-2 bg-red-500 text-white rounded"
      >
        Show Deny Request Popup
      </button>
      <button
        onClick={() => {
          setActivePopup("approve");
        }}
        className="px-4 py-2 bg-green-500 text-white rounded"
      >
        Show Approve Request Popup
      </button>
      <button
        onClick={() => {
          setActivePopup("invite");
        }}
        className="px-4 py-2 bg-blue-500 text-white rounded"
      >
        Show Invite Admin Popup
      </button>
      <button
        onClick={() => {
          setActivePopup("remove");
        }}
        className="px-4 py-2 bg-yellow-500 text-black rounded"
      >
        Show Remove Admin Popup
      </button>

      {renderPopup()}
    </div>
  );
}
