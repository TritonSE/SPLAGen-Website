"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import styles from "./landingPage.module.css";

import { Discussion, getPosts } from "@/api/discussion";
import { PostCard } from "@/components/PostCard";
import { UserContext } from "@/contexts/userContext";
import { useRedirectToLoginIfNotSignedIn } from "@/hooks/useRedirection";

export default function LandingPage() {
  useRedirectToLoginIfNotSignedIn();

  const { t } = useTranslation();

  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("");
  const [posts, setPosts] = useState<Discussion[]>();
  const [errorMessage, setErrorMessage] = useState("");

  const { firebaseUser } = useContext(UserContext);

  const loadPosts = useCallback(async () => {
    if (!firebaseUser) return;

    setErrorMessage("");
    try {
      const token = await firebaseUser.getIdToken();
      const response = await getPosts(token, sort || "newest", search);
      if (response.success) {
        setPosts(response.data);
      } else {
        setErrorMessage(`Failed to fetch discussion posts: ${response.error}`);
      }
    } catch (error) {
      setErrorMessage(`Failed to fetch discussion posts: ${String(error)}`);
    }
  }, [firebaseUser, search, sort]);

  useEffect(() => {
    void loadPosts();
  }, [firebaseUser, search, sort, loadPosts]);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>{t("Discussion")}</h1>
      </div>
      <div className={styles.searchForm}>
        {/* Wrap the search input and 'Sort By' dropdown */}
        <div className={styles.searchAllSortContainer}>
          <input
            type="text"
            placeholder={t("Search General")}
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
                  <option value="">{t("Sort By")}</option>
                  <option value="newest">{t("Newest First")}</option>
                  <option value="oldest">{t("Oldest First")}</option>
                </select>

                <div className={styles.sortIconWrapper}>
                  <Image src="/icons/sort.svg" alt="Sort arrows" width={24} height={24} />
                </div>
              </div>
            </div>
          </div>
        </div>

        <Link href="/discussion/post" className={styles.newPostButton}>
          Create Post
          <Image src="/icons/plus.svg" alt="Plus icon" width={24} height={24} />
        </Link>
      </div>
      <div className={styles.scrollContainer}>
        {posts?.map((post) => (
          <PostCard
            key={post._id}
            href={`/discussion/${post._id}`}
            author={post.userId}
            createdAt={post.createdAt}
            title={post.title}
            message={post.message}
          />
        ))}

        {posts && posts.length === 0 && <div>No posts found</div>}
      </div>
      {errorMessage && <div className="text-red-500">{errorMessage}</div>}
    </div>
  );
}
