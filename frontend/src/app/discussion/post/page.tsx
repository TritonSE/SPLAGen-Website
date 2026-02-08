"use client";

import React from "react";

import { DiscussionForm } from "@/components/DiscussionForm";
import { useRedirectToLoginIfNotSignedIn } from "@/hooks/useRedirection";
import "@/app/globals.css";

const CreatePostPage: React.FC = () => {
  useRedirectToLoginIfNotSignedIn();

  return <DiscussionForm />;
};

export default CreatePostPage;
