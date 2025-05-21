"use client";
import Link from "next/link";
import React, { useContext, useState } from "react";

import { EditBasicInfoModal, External, LanguageSwitcher, PostCard } from "@/components";
import { UserContext } from "@/contexts/userContext";

export default function Dashboard() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const { user } = useContext(UserContext);

  return (
    <div className="p-4">
      <h1> Dashboard/Home </h1>
      <p>
        <Link href="/login">go to login</Link>
      </p>
      <p>
        <Link href="/phoneInputDemo"> Go to phone input demo </Link>
      </p>
      <p>
        <Link href="/discussion/post"> Go to post</Link>
      </p>
      <p>
        <Link href="flowPopupDemo"> Go to flow popup demo </Link>
      </p>
      <p>
        <Link href="/profile"> Go to profile flow </Link>
      </p>

      <div className="grid grid-rows-[20px_1fr_20px] items-center min-h-screen">
        <main className="flex flex-col gap-8 row-start-2 items-center">
          <LanguageSwitcher />
          <External />

          {user && (
            <p>
              {user.personal.firstName} {user.role}
            </p>
          )}
          <EditBasicInfoModal isOpen={isModalOpen} onClose={handleCloseModal} />
          {/* <ProfessionalInfoModal isOpen={isModalOpen} onClose={handleCloseModal} /> */}

          {/* Render a sample PostCard */}
          <PostCard
            authorName="Alex Johnson"
            date="April 7, 2025"
            time="11:45 AM"
            title="Welcome to the Community!"
            message="We're excited to have you here. Let us know if you need anything."
            audience="New Joiners"
          />
        </main>
      </div>
    </div>
  );
}
