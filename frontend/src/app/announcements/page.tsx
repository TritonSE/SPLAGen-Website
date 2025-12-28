"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useContext, useEffect, useState } from "react";

import styles from "./page.module.css";

import { Announcement, getAnnouncements } from "@/api/announcement";
import { PostCard } from "@/components";
import { UserContext } from "@/contexts/userContext";
import { useRedirectToLoginIfNotSignedIn } from "@/hooks/useRedirection";

const Announcements: React.FC = () => {
  useRedirectToLoginIfNotSignedIn();

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
      const response = await getAnnouncements(token, sort || "newest", search);
      if (response.success) {
        setAnnouncements(response.data);
      } else {
        setErrorMessage(`Failed to fetch announcements: ${response.error}`);
      }
    } catch (error) {
      setErrorMessage(`Failed to fetch announcements: ${String(error)}`);
    }
  }, [firebaseUser, search, sort]);

  useEffect(() => {
    void loadAnnouncements();
  }, [firebaseUser, search, sort, loadAnnouncements]);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Announcements</h1>
      </div>
      <div className={styles.searchForm}>
        {/* Wrap the search input and 'Sort By' dropdown */}
        <div className={styles.searchAllSortContainer}>
          <input
            type="text"
            placeholder="Search Announcements"
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
                  <option value="">Sort By</option>
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
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
            Create Announcement
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
        {announcements && announcements.length === 0 && <p>No announcements found</p>}
      </div>
      {errorMessage && <div className="text-red-500">{errorMessage}</div>}
    </div>
  );
};

export default Announcements;
