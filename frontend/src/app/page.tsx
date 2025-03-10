"use client"; // This marks the component as a client component
import Link from "next/link";
import React, { useState } from "react";

import { EditBasicInfoModal, External, LanguageSwitcher } from "@/components";
export default function Dashboard() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };
  return (
    <div>
      <h1> Dashboard/Home </h1>
      <Link href="/login">go to login</Link>

      <div className="grid grid-rows-[20px_1fr_20px] items-center min-h-screen">
        <main className="flex flex-col gap-8 row-start-2 items-center">
          {/* Added the LanguageSwitcher component */}
          <LanguageSwitcher />
          {/* External is my text component */}
          <External></External>
        </main>
        <button onClick={handleOpenModal}>Open Post Modal</button>
        {/* <DirectoryInfoModal isOpen={isModalOpen} onClose={handleCloseModal} /> */}
        <EditBasicInfoModal isOpen={isModalOpen} onClose={handleCloseModal} />
        {/* <CreatePostModal isOpen={isModalOpen} onClose={handleCloseModal} /> */}
      </div>
    </div>
  );
}
