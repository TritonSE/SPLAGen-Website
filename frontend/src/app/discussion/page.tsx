"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";

import styles from "./landingPage.module.css";

import { Discussion, getPost } from "@/api/discussion";
import { PostCard } from "@/components/PostCard";
type Post = {
  id: string;
  title: string;
  content: string;
  date: string;
  author: string;
  audience?: string;
  time?: string;
};

const SearchSchema = z.object({
  query: z.string().optional(),
  sort: z.string().optional(),
});

type SearchFormInputs = z.infer<typeof SearchSchema>;

export default function LandingPage() {
  const { t } = useTranslation();
  const formRef = useRef<HTMLFormElement>(null);

  const [originalPosts, setOriginalPosts] = useState<Post[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  const { register, handleSubmit } = useForm<SearchFormInputs>({
    resolver: zodResolver(SearchSchema),
    defaultValues: {
      query: "",
      sort: "",
    },
  });

  const mapDiscussionToPost = (discussion: Discussion): Post => ({
    id: discussion._id,
    title: discussion.title,
    content: discussion.message,
    date: discussion.createdAt,
    author: discussion.username,
    audience: discussion.audience,
    time: discussion.time,
  });

  // pass through string only instead
  const firebaseToken = "dummy-token";

  useEffect(() => {
    const fetchPosts = async () => {
      const result = await getPost(firebaseToken);

      if (result.success) {
        const fetchedPosts = result.data.map(mapDiscussionToPost);
        setOriginalPosts(fetchedPosts);
        setPosts(fetchedPosts);
      } else {
        console.error("Failed to load posts", result.error);
      }
      setLoading(false);
    };
    void fetchPosts();
  }, []);

  const onSubmit: SubmitHandler<SearchFormInputs> = (data) => {
    const searchQuery = data.query?.toLowerCase() ?? "";
    const filtered = originalPosts.filter(
      (post) =>
        post.title.toLowerCase().includes(searchQuery) ||
        post.content.toLowerCase().includes(searchQuery),
    );

    switch (data.sort) {
      case "date-desc":
        filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        break;
      case "date-asc":
        filtered.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        break;
      case "author-asc":
        filtered.sort((a, b) => a.author.localeCompare(b.author));
        break;
      case "author-desc":
        filtered.sort((a, b) => b.author.localeCompare(a.author));
        break;
      case undefined: {
        throw new Error("Not implemented yet: undefined case");
      }
      default:
        break;
    }

    setPosts(filtered);
  };

  if (loading) return <div>{t("Loading...")}</div>;

  const normalizeDate = (date: Date) => {
    const normalizedDate = new Date(date);
    normalizedDate.setHours(0, 0, 0, 0);
    return normalizedDate;
  };

  // Step 1: Sort all posts by date (descending)
  const sortedPosts = [...posts].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );

  // Step 2: Take only the top N visible posts
  const visiblePosts = sortedPosts;

  // Step 3: Create time boundaries
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay());
  startOfWeek.setHours(0, 0, 0, 0);

  const endOfWeek = new Date(today);
  endOfWeek.setDate(today.getDate() + (6 - today.getDay()));
  endOfWeek.setHours(23, 59, 59, 999);

  // Step 4: Group the visible posts
  const todayPosts: Post[] = [];
  const thisWeekPosts: Post[] = [];
  const earlierPosts: Post[] = [];

  visiblePosts.forEach((post) => {
    const postDate = new Date(post.date);
    const normalizedPostDate = normalizeDate(postDate);

    if (normalizedPostDate.getTime() === today.getTime()) {
      todayPosts.push(post);
    } else if (postDate >= startOfWeek && postDate <= endOfWeek) {
      thisWeekPosts.push(post);
    } else {
      earlierPosts.push(post);
    }
  });

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>{t("Discussion")}</h1>
      </div>

      <form
        ref={formRef}
        onSubmit={(e) => void handleSubmit(onSubmit)(e)}
        className={styles.searchForm}
      >
        {/* Wrap the search input and 'Sort By' dropdown */}
        <div className={styles.searchAllSortContainer}>
          <input
            type="text"
            {...register("query")}
            placeholder={t("Search General")}
            className={styles.searchInput}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                formRef.current?.requestSubmit();
              }
            }}
          />

          <div className={styles.selectWrapper}>
            <div className={styles.selectWrapper}>
              <div className={styles.sortContainer}>
                <select className={styles.sortSelect} {...register("sort")}>
                  <option value="">{t("Sort By")}</option>
                  <option value="date-desc">{t("Newest First")}</option>
                  <option value="date-asc">{t("Oldest First")}</option>
                  <option value="author-asc">{t("Author A-Z")}</option>
                  <option value="author-desc">{t("Author Z-A")}</option>
                </select>

                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  className={styles.sortIcon}
                >
                  <path
                    d="M8 20V10M8 20L5 17M8 20L11 17M16 4V14M16 4L19 7M16 4L13 7"
                    stroke="#909090"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <Link href="/discussion/post" className={styles.newPostButton}>
          {t("Create Discussion +")}
        </Link>
      </form>

      <div className={styles.scrollContainer}>
        {/* Today's Posts */}
        {todayPosts.length > 0 && (
          <div className={styles.todaySection}>
            <div className={styles.sectionHeader}>
              <h2>{t("Today")}</h2>
            </div>

            <div className={styles.postList}>
              {todayPosts
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                .map((post) => (
                  <div key={post.id} className={styles.postWrapper}>
                    <PostCard
                      authorName={post.author}
                      date={post.date}
                      time={post.time}
                      title={post.title}
                      message={post.content}
                      audience={post.audience}
                    />
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* This Week's Posts */}
        {thisWeekPosts.length > 0 && (
          <div className={styles.thisWeekSection}>
            <h2>{t("This Week")}</h2>
            {thisWeekPosts
              .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
              .map((post) => (
                <PostCard
                  key={post.id}
                  authorName={post.author}
                  date={post.date}
                  time={post.time}
                  title={post.title}
                  message={post.content}
                  audience={post.audience}
                />
              ))}
          </div>
        )}

        {/* Earlier Posts */}
        {earlierPosts.length > 0 && (
          <div className={styles.earlierSection}>
            <h2>{t("Earlier")}</h2>
            {earlierPosts
              .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
              .map((post) => (
                <PostCard
                  key={post.id}
                  authorName={post.author}
                  date={post.date}
                  time={post.time}
                  title={post.title}
                  message={post.content}
                  audience={post.audience}
                />
              ))}
          </div>
        )}

        {/* If no posts */}
        {posts.length === 0 && <div>No posts yet.</div>}
      </div>
    </div>
  );
}
