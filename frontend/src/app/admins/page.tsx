"use client";

import { MembersTablePage } from "@/components/MembersTablePage";
import {
  useRedirectToHomeIfNotSuperAdmin,
  useRedirectToLoginIfNotSignedIn,
} from "@/hooks/useRedirection";
import "@/app/globals.css";

export default function Members() {
  useRedirectToLoginIfNotSignedIn();
  useRedirectToHomeIfNotSuperAdmin();

  return <MembersTablePage adminsView />;
}
