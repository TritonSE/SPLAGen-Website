"use client";

import { MembersTablePage } from "@/components/MembersTablePage";
import {
  useRedirectToHomeIfNotSuperAdmin,
  useRedirectToLoginIfNotSignedIn,
} from "@/hooks/useRedirection";

export default function Members() {
  useRedirectToLoginIfNotSignedIn();
  useRedirectToHomeIfNotSuperAdmin();

  return <MembersTablePage adminsView />;
}
