"use client";
import Link from "next/link";
import React, { useContext, useState } from "react";

import { EditBasicInfoModal, External, LanguageSwitcher } from "@/components";
import { UserContext } from "@/contexts/userContext";

export default function Dashboard() {
  const [isModalOpen, setIsModalOpen] = useState(false);

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
      <p>
        <Link href="/login">go to login</Link>
      </p>
      <p>
        <Link href="/phoneInputDemo"> Go to phone input demo </Link>
      </p>
      <p>
        <Link href="flowPopupDemo"> Go to flow popup demo </Link>
      </p>
      <p>
        <Link href="/profile"> Go to flow profile page WIP demo </Link>
      </p>

      <div className="grid grid-rows-[20px_1fr_20px] items-center min-h-screen">
        <main className="flex flex-col gap-8 row-start-2 items-center">
          {/* Added the LanguageSwitcher component */}
          <LanguageSwitcher />
          {/* External is my text component */}
          <External></External>

          {user && (
            <p>
              {user.personal.firstName} {user.role}
            </p>
          )}
          <button onClick={handleOpenModal}>Open Post Modal</button>
          {/* <DirectoryInfoModal isOpen={isModalOpen} onClose={handleCloseModal} /> */}
          <EditBasicInfoModal isOpen={isModalOpen} onClose={handleCloseModal} />
          {/* <CreatePostModal isOpen={isModalOpen} onClose={handleCloseModal} /> */}
          {/* <ProfessionalInfoModal isOpen={isModalOpen} onClose={handleCloseModal} /> */}
        </main>
      </div>
    </div>
  );
}
