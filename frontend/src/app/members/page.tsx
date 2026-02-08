"use client";

import { MembersTablePage } from "@/components/MembersTablePage";
import {
  useRedirectToHomeIfNotAdminOrSuperAdmin,
  useRedirectToLoginIfNotSignedIn,
} from "@/hooks/useRedirection";
import "@/app/globals.css";

export default function Members() {
  useRedirectToLoginIfNotSignedIn();
  useRedirectToHomeIfNotAdminOrSuperAdmin();

  return <MembersTablePage adminsView={false} />;
}
