"use client";

import React from "react";

import { DiscussionForm } from "@/components/DiscussionForm";
import { useRedirectToLoginIfNotSignedIn } from "@/hooks/useRedirection";

const CreatePostPage: React.FC = () => {
  useRedirectToLoginIfNotSignedIn();

  return <DiscussionForm />;
};

export default CreatePostPage;
