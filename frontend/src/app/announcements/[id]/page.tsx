"use client";

import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useCallback, useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import styles from "./page.module.css";

import { Announcement, getIndividualAnnouncement } from "@/api/announcement";
import { PostPageView } from "@/components/PostPageView";
import { UserContext } from "@/contexts/userContext";
import { useRedirectToLoginIfNotSignedIn } from "@/hooks/useRedirection";

const AnnouncementDetailPage = () => {
  const { t } = useTranslation();
  useRedirectToLoginIfNotSignedIn();
  const params = useParams();

  const { isAdminOrSuperAdmin, firebaseUser } = useContext(UserContext);
  const [errorMessage, setErrorMessage] = useState("");
  const [announcement, setAnnouncement] = useState<Announcement | null>(null);

  const loadAnnouncement = useCallback(async () => {
    if (!firebaseUser || !params.id) return;

    try {
      const token = await firebaseUser.getIdToken();
      const response = await getIndividualAnnouncement(token, params.id as string);
      if (response.success) {
        setAnnouncement(response.data);
      } else {
        setErrorMessage(`${t("failed-to-retrieve-announcement")}: ${response.error}`);
      }
    } catch (error) {
      setErrorMessage(`${t("failed-to-retrieve-announcement")}: ${String(error)}`);
    }
  }, [firebaseUser, params, t]);

  useEffect(() => {
    void loadAnnouncement();
  }, [firebaseUser, params, loadAnnouncement]);

  return (
    <div className={styles.pageContainer}>
      <h1 className={styles.title}>{t("announcements")}</h1>
      <Link href="/announcements" className={styles.backButton}>
        <ChevronLeft />
        {t("back")}
      </Link>

      {announcement && (
        <PostPageView
          showDotsMenu={isAdminOrSuperAdmin}
          post={{ variant: "announcement", data: announcement }}
        />
      )}

      {errorMessage && <div className="text-red-500">{errorMessage}</div>}
    </div>
  );
};

export default AnnouncementDetailPage;
