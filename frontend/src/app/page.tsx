"use client";

import React, { useCallback, useContext, useEffect, useState } from "react";

import styles from "./page.module.css";

import { MemberStats, getMemberStats } from "@/api/admin";
import { Announcement, getAnnouncements } from "@/api/announcement";
import { YoutubeVideo, getYoutubeVideos } from "@/api/videos";
import { LanguageSwitcher, PostCard } from "@/components";
import { MemberCountCard } from "@/components/MemberCountCard";
import { ResourceCard } from "@/components/ResourceCard";
import { UserContext } from "@/contexts/userContext";
import { useRedirectToLoginIfNotSignedIn } from "@/hooks/useRedirection";

export default function Dashboard() {
  useRedirectToLoginIfNotSignedIn();

  const [recentAnnouncements, setRecentAnnouncements] = useState<Announcement[]>();
  const [memberStats, setMemberStats] = useState<MemberStats>();
  const [youtubeVideos, setYoutubeVideos] = useState<YoutubeVideo[]>();
  const [errorMessage, setErrorMessage] = useState("");

  const { firebaseUser, isAdminOrSuperAdmin, isSuperAdmin } = useContext(UserContext);

  const loadAnnouncements = useCallback(async () => {
    if (!firebaseUser) return;

    try {
      setErrorMessage("");
      const token = await firebaseUser.getIdToken();
      // Show up to 5 most recent announcements
      const response = await getAnnouncements(token, "newest", "", 1, 5);
      if (response.success) {
        setRecentAnnouncements(response.data.announcements);
      } else {
        setErrorMessage(`Failed to fetch announcements: ${response.error}`);
      }
    } catch (error) {
      setErrorMessage(`Failed to fetch announcements: ${String(error)}`);
    }
  }, [firebaseUser]);

  useEffect(() => {
    void loadAnnouncements();
  }, [firebaseUser, loadAnnouncements]);

  const loadMemberStats = useCallback(async () => {
    if (!firebaseUser || !isAdminOrSuperAdmin) return;

    try {
      setErrorMessage("");
      const token = await firebaseUser.getIdToken();
      const response = await getMemberStats(token);
      if (response.success) {
        setMemberStats(response.data);
      } else {
        setErrorMessage(`Failed to fetch member counts: ${response.error}`);
      }
    } catch (error) {
      setErrorMessage(`Failed to fetch member counts: ${String(error)}`);
    }
  }, [firebaseUser, isAdminOrSuperAdmin]);

  useEffect(() => {
    void loadMemberStats();
  }, [firebaseUser, loadMemberStats]);

  const loadYoutubeVideos = useCallback(async () => {
    try {
      setErrorMessage("");
      const response = await getYoutubeVideos();
      if (response.success) {
        setYoutubeVideos(response.data);
      } else {
        setErrorMessage(`Failed to fetch YouTube videos: ${response.error}`);
      }
    } catch (error) {
      setErrorMessage(`Failed to fetch YouTube videos: ${String(error)}`);
    }
  }, []);

  useEffect(() => {
    void loadYoutubeVideos();
  }, [loadYoutubeVideos]);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Dashboard</h1>

      {memberStats && (
        <div className="flex flex-row gap-16 overflow-x-auto">
          <MemberCountCard
            count={memberStats.memberCount}
            label="Members"
            href="/members?tab=all"
          />
          <MemberCountCard
            count={memberStats.directoryCount}
            label="in Directory"
            href="/members?tab=directory"
          />
          {isSuperAdmin && (
            <MemberCountCard count={memberStats.adminCount} label="Admins" href="/admins" />
          )}
        </div>
      )}

      <div className="flex flex-col gap-4">
        <h2 className={styles.subtitle}>Resources</h2>
        <p>Click on each card to access the external resource page.</p>
        <div className="flex flex-row gap-12 overflow-x-auto">
          <ResourceCard
            iconSrc="/icons/education.svg"
            label="Education"
            href="https://drive.google.com/drive/folders/1yv2D8KsLlUgcRScUS86G_DOOzUiXM3ln?usp=drive_link"
          />
          <ResourceCard
            iconSrc="/icons/public_policy.svg"
            label="Public Policy"
            href="https://drive.google.com/drive/folders/1Xxd0MRpT-RBxMVUakFr9ykWz6qzitLnX?usp=drive_link"
          />
          <ResourceCard
            iconSrc="/icons/research.svg"
            label="Research"
            href="https://drive.google.com/drive/folders/1LJ4UUgTKIUS6Bj8bip0hj2rQBaetzWsb"
          />
          <ResourceCard
            iconSrc="/icons/members.svg"
            label="Members"
            href="https://drive.google.com/drive/folders/1D_0kRA4leoOnFMjdvlF5YMdt1x6KGxjU?usp=drive_link"
          />
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <h2 className={styles.subtitle}>YouTube videos</h2>
        <div className="flex flex-row gap-12 overflow-x-auto">
          {youtubeVideos?.map((video) => (
            <div key={video.id}>
              <a
                href={`https://www.youtube.com/watch?v=${video.id}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <div
                  className={styles.thumbnail}
                  style={{
                    backgroundImage: `url('${video.thumbnail}')`,
                  }}
                ></div>
              </a>
            </div>
          ))}
        </div>
        <p>
          Visit our{" "}
          <a
            className="underline text-blue-60"
            href="https://www.youtube.com/@SPLAGen"
            target="_blank"
            rel="noopener noreferrer"
          >
            YouTube channel
          </a>{" "}
          for more videos!
        </p>
      </div>

      <div className="flex flex-col gap-4">
        <h2 className={styles.subtitle}>Recent Announcements</h2>
        {recentAnnouncements?.map((announcement) => (
          <PostCard
            key={announcement._id}
            href={`/announcements/${announcement._id}`}
            author={announcement.userId}
            createdAt={announcement.createdAt}
            title={announcement.title}
            message={announcement.message}
          />
        ))}
        {recentAnnouncements && recentAnnouncements.length === 0 && <p>No announcements found</p>}
      </div>

      {/* TODO: move language switcher to profile dropdown */}
      <LanguageSwitcher />

      {errorMessage && <div className="text-red-500">{errorMessage}</div>}
    </div>
  );
}
