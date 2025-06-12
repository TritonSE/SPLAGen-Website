"use client";
// import Image from "next/image";
// import Link from "next/link";
import { useContext, useEffect, useState } from "react";
// import { SubmitHandler, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
// import { z } from "zod";

import styles from "./dashboard.module.css";

import { Announcement, getPost } from "@/api/announcement";
import { PostCard } from "@/components/PostCard";
import { UserContext } from "@/contexts/userContext";

type Post = {
  id: string;
  title: string;
  content: string;
  date: string;
  author: string;
  recipients: string | string[];
};

export default function Dashboard() {
  // const POSTS_PER_LOAD = 5;

  const { user } = useContext(UserContext);
  const [isAdmin, setIsAdmin] = useState(false);
  // const [visibleCount, setVisibleCount] = useState(POSTS_PER_LOAD);
  const { t } = useTranslation();

  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [showTooltip, setShowTooltip] = useState(false);

  const handleToggleTooltip = () => {
    setShowTooltip((prev) => !prev);
  };

  useEffect(() => {
    if (user) {
      switch (user.role) {
        case "member":
          break;
        case "admin":
        case "superadmin":
          setIsAdmin(true);
          break;
      }
    }
  }, [user]);

  const mapAnnouncementToPost = (announcement: Announcement): Post => ({
    id: announcement._id,
    title: announcement.title,
    content: announcement.message,
    date: announcement.createdAt,
    author: announcement.userId,
    recipients: announcement.recipients,
  });

  useEffect(() => {
    const fetchPosts = async () => {
      const result = await getPost("temporary-firebase-token");

      if (result.success) {
        if (Array.isArray(result.data)) {
          const fetchedPosts = result.data.map(mapAnnouncementToPost);
          setPosts(fetchedPosts);
        } else {
          console.error("Expected an array but got:", result.data);
        }
      } else {
        console.error("Failed to load posts", result.error);
      }
      setLoading(false);
    };
    void fetchPosts();
  }, []);

  if (loading) return <div>{t("Loading...")}</div>;

  const resourceCards = [
    {
      href: "https://drive.google.com/drive/folders/1yv2D8KsLlUgcRScUS86G_DOOzUiXM3ln?usp=drive_link",
      imgSrc: "/images/educational.svg",
      imgAlt: "educationIcon",
      title: "Educational",
      description: "Meeting notes, educational materials, and curriculum development resources.",
    },
    {
      href: "https://drive.google.com/drive/folders/1Xxd0MRpT-RBxMVUakFr9ykWz6qzitLnX?usp=drive_link",
      imgSrc: "/images/publicPolicy.svg",
      imgAlt: "publicIcon",
      title: "Public Policy",
      description: "Access meeting notes, review policy statements, and advocacy resources.",
    },
    {
      href: "https://drive.google.com/drive/folders/1LJ4UUgTKIUS6Bj8bip0hj2rQBaetzWsb",
      imgSrc: "/images/research.svg",
      imgAlt: "researchIcon",
      title: "Research",
      description: "Access meeting notes and other research related resources.",
    },
    {
      href: "https://drive.google.com/drive/folders/1D_0kRA4leoOnFMjdvlF5YMdt1x6KGxjU?usp=drive_link",
      imgSrc: "/images/members.svg",
      imgAlt: "membersIcon",
      title: "Members",
      description: "Access meeting notes, marketing materials, and outreach resources.",
    },
  ];

  return (
    <div className={styles.dash}>
      <div className={styles.titleBar}>
        <h1 className={styles.title}> Dashboard </h1>
      </div>
      <div className={styles.content}>
        {isAdmin && (
          <div className={styles.countContainer}>
            <div className={styles.countCard}>
              <div className={styles.countNum}>
                <h1 className={styles.numHeader}>##</h1>
                <h2 className={styles.numSubheader}>Members</h2>
              </div>
              <img src="/Icons/arrow.svg" alt="arrowIcon" />
            </div>
            <div className={styles.countCard}>
              <div className={styles.countNum}>
                <h1 className={styles.numHeader}>##</h1>
                <h2 className={styles.numSubheader}>in Directory</h2>
              </div>
              <img src="/Icons/arrow.svg" alt="arrowIcon" />
            </div>
            <div className={styles.countCard}>
              <div className={styles.countNum}>
                <h1 className={styles.numHeader}>##</h1>
                <h2 className={styles.numSubheader}>Admins</h2>
              </div>
              <img src="/Icons/arrow.svg" alt="arrowIcon" />
            </div>
          </div>
        )}
        <div className={styles.resources}>
          <div className={styles.resourceHeading}>
            <h2 className={styles.resourcesH2}>Resources</h2>
            <button onClick={handleToggleTooltip} aria-label="More info">
              <img src="/Icons/purpleInfo.svg" alt="info icon" />
            </button>
            {showTooltip && (
              <div className={styles.tooltip}>
                <img src="/Icons/Pointer.svg" alt="pointer" />
                <p className={styles.tooltipText}>
                  Click each link to access the external resource page.
                </p>
              </div>
            )}
          </div>
          <div className={styles.resourceCards}>
            {resourceCards.map((card, idx) => (
              <a key={idx} href={card.href} target="_blank" className={styles.resourceCard}>
                <div className={styles.cardInfo}>
                  <img src={card.imgSrc} alt={card.imgAlt} />
                  <div className={styles.cardText}>
                    <h3 className={styles.cardTitle}>{card.title}</h3>
                    <p className={styles.cardDescription}>{card.description}</p>
                  </div>
                </div>
                <span className={styles.rectangle}></span>
              </a>
            ))}
          </div>
        </div>
        <div className={styles.announcements}>
          <h2 className={styles.resourcesH2}>Recent Announcements</h2>
          {!loading && posts.length === 0 && <div>{t("No announcements yet.")}</div>}

          <div className={styles.announcementContainer}>
            {posts
              .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
              .slice(0, 5)
              .map((post) => (
                <PostCard
                  key={post.id}
                  authorName={post.author}
                  date={post.date}
                  title={post.title}
                  audience={
                    Array.isArray(post.recipients) ? post.recipients.join(", ") : post.recipients
                  }
                  message={post.content}
                />
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
