"use client";

import React from "react";

import { AnnouncementForm } from "@/components/AnnouncementForm";
import { useRedirectToLoginIfNotSignedIn } from "@/hooks/useRedirection";

const CreateAnnouncementPage: React.FC = () => {
  useRedirectToLoginIfNotSignedIn();

  return <AnnouncementForm />;
};

export default CreateAnnouncementPage;
