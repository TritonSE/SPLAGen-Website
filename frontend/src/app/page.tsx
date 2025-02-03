"use client"; // This marks the component as a client component

import React, { useState } from "react";

//import CreatePostModal from "@/components/DirectoryInfoModal";
import DirectoryInfoModal from "./components/DirectoryInfoModal";

const Page: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div>
      <h1>Welcome to the Page</h1>
      <button onClick={handleOpenModal}>Open Post Modal</button>

      <DirectoryInfoModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={function (): void {
          throw new Error("Function not implemented.");
        }}
      />
    </div>
  );
};

export default Page;
