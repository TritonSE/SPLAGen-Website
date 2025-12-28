"use client";

import { useParams } from "next/navigation";
import { useCallback, useContext, useEffect, useState } from "react";

import { Announcement, getIndividualAnnouncement } from "@/api/announcement";
import { AnnouncementForm } from "@/components/AnnouncementForm";
import { UserContext } from "@/contexts/userContext";
import { useRedirectToLoginIfNotSignedIn } from "@/hooks/useRedirection";

const EditAnnouncementPage = () => {
  useRedirectToLoginIfNotSignedIn();
  const params = useParams();

  const { firebaseUser } = useContext(UserContext);
  const [errorMessage, setErrorMessage] = useState("");
  const [announcement, setAnnouncement] = useState<Announcement>();

  const loadAnnouncement = useCallback(async () => {
    if (!firebaseUser || !params.id) return;

    try {
      const token = await firebaseUser.getIdToken();
      const response = await getIndividualAnnouncement(token, params.id as string);
      if (response.success) {
        setAnnouncement(response.data);
      } else {
        setErrorMessage(`Failed to retrieve announcement: ${response.error}`);
      }
    } catch (error) {
      setErrorMessage(`Failed to retrieve announcement: ${String(error)}`);
    }
  }, [firebaseUser, params]);

  useEffect(() => {
    void loadAnnouncement();
  }, [firebaseUser, params, loadAnnouncement]);

  return (
    <>
      <AnnouncementForm announcement={announcement} />
      {errorMessage && <div className="text-red-500">{errorMessage}</div>}
    </>
  );
};

export default EditAnnouncementPage;
