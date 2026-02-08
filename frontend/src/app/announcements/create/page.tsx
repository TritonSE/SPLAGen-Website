"use client";

import React from "react";

import { AnnouncementForm } from "@/components/AnnouncementForm";
import { useRedirectToLoginIfNotSignedIn } from "@/hooks/useRedirection";
import "@/app/globals.css";

const CreateAnnouncementPage: React.FC = () => {
  useRedirectToLoginIfNotSignedIn();

  return <AnnouncementForm />;
};

export default CreateAnnouncementPage;
