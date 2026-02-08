"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import styles from "./page.module.css";

import { ANNOUNCEMENTS_PAGE_SIZE, Announcement, getAnnouncements } from "@/api/announcement";
import { PostCard } from "@/components";
import { Pagination } from "@/components/Pagination";
import { UserContext } from "@/contexts/userContext";
import { useRedirectToLoginIfNotSignedIn } from "@/hooks/useRedirection";

const Announcements: React.FC = () => {
  const { t } = useTranslation();
  useRedirectToLoginIfNotSignedIn();

  const [page, setPage] = useState(1);
  const [numPages, setNumPages] = useState(1);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("");
  const [announcements, setAnnouncements] = useState<Announcement[]>();
  const [errorMessage, setErrorMessage] = useState("");

  const { firebaseUser, isAdminOrSuperAdmin } = useContext(UserContext);

  const loadAnnouncements = useCallback(async () => {
    if (!firebaseUser) return;

    try {
      setErrorMessage("");
      const token = await firebaseUser.getIdToken();
      const response = await getAnnouncements(token, sort || "newest", search, page);
      if (response.success) {
        setAnnouncements(response.data.announcements);
        setNumPages(Math.ceil(response.data.count / ANNOUNCEMENTS_PAGE_SIZE));
      } else {
        setErrorMessage(`${t("failed-to-fetch-announcements")}: ${response.error}`);
      }
    } catch (error) {
      setErrorMessage(`${t("failed-to-fetch-announcements")}: ${String(error)}`);
    }
  }, [firebaseUser, search, sort, page, t]);

  useEffect(() => {
    void loadAnnouncements();
  }, [firebaseUser, search, sort, page, loadAnnouncements]);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>{t("announcements")}</h1>
      </div>
      <div className={styles.searchForm}>
        {/* Wrap the search input and 'Sort By' dropdown */}
        <div className={styles.searchAllSortContainer}>
          <input
            type="text"
            placeholder={t("search-announcements")}
            className={styles.searchInput}
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
            }}
          />

          <div className={styles.selectWrapper}>
            <div className={styles.selectWrapper}>
              <div className={`${styles.sortContainer} ${sort ? styles.activeSort : ""}`}>
                <select
                  className={styles.sortSelect}
                  onChange={(e) => {
                    setSort(e.target.value);
                  }}
                  value={sort}
                >
                  <option value="">{t("sort-by")}</option>
                  <option value="newest">{t("newest-first")}</option>
                  <option value="oldest">{t("oldest-first")}</option>
                </select>

                <div className={styles.sortIconWrapper}>
                  <Image src="/icons/sort.svg" alt="Sort arrows" width={24} height={24} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {isAdminOrSuperAdmin && (
          <Link href="/announcements/create" className={styles.newPostButton}>
            {t("create-announcement")}
            <Image src="/icons/plus.svg" alt="Plus icon" width={24} height={24} />
          </Link>
        )}
      </div>
      <div className={styles.scrollContainer}>
        {announcements?.map((announcement) => (
          <PostCard
            key={announcement._id}
            href={`/announcements/${announcement._id}`}
            author={announcement.userId}
            createdAt={announcement.createdAt}
            title={announcement.title}
            message={announcement.message}
          />
        ))}
        {announcements && announcements.length === 0 && <p>{t("no-announcements-found")}</p>}
      </div>

      <Pagination currentPage={page} numPages={numPages} onPageChange={setPage} />
      {errorMessage && <div className="text-red-500">{errorMessage}</div>}
    </div>
  );
};

export default Announcements;
