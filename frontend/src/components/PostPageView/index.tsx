"use client";

import moment from "moment";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useCallback, useContext, useEffect, useState } from "react";

import styles from "./styles.module.css";

import { Announcement, deleteAnnouncement } from "@/api/announcement";
import { Discussion, deleteDiscussion } from "@/api/discussion";
import { Reply, deleteReply, getReplies } from "@/api/reply";
import { Button } from "@/components";
import { ProfilePicture } from "@/components/ProfilePicture";
import { ReplyComposer } from "@/components/ReplyComposer";
import { TwoButtonPopup } from "@/components/modals/TwoButtonPopup";
import { UserContext } from "@/contexts/userContext";

type PostPageViewProps = {
  showDotsMenu: boolean;
  post:
    | {
        variant: "announcement";
        data: Announcement;
      }
    | {
        variant: "discussion";
        data: Discussion;
      }
    | {
        variant: "reply";
        data: Reply;
        reloadReplies: () => unknown;
      };
};

export const PostPageView = ({ showDotsMenu, post }: PostPageViewProps) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [newReplyComposerOpen, setNewReplyComposerOpen] = useState(false);
  const [editReplyComposerOpen, setEditReplyComposerOpen] = useState(false);
  const [replies, setReplies] = useState<Reply[]>();
  const router = useRouter();

  const { firebaseUser, user, isAdminOrSuperAdmin } = useContext(UserContext);

  const handleDelete = async () => {
    if (!firebaseUser) return;

    switch (post.variant) {
      case "announcement": {
        try {
          const token = await firebaseUser.getIdToken();
          const response = await deleteAnnouncement(token, post.data._id);
          if (response.success) {
            router.push("/announcements");
          } else {
            setErrorMessage(`Failed to delete announcement: ${response.error}`);
          }
        } catch (error) {
          setErrorMessage(`Failed to delete announcement: ${String(error)}`);
        }
        break;
      }
      case "discussion": {
        try {
          const token = await firebaseUser.getIdToken();
          const response = await deleteDiscussion(token, post.data._id);
          if (response.success) {
            router.push("/discussion");
          } else {
            setErrorMessage(`Failed to delete post: ${response.error}`);
          }
        } catch (error) {
          setErrorMessage(`Failed to delete post: ${String(error)}`);
        }
        break;
      }
      case "reply": {
        try {
          const token = await firebaseUser.getIdToken();
          const response = await deleteReply(token, post.data._id);
          if (response.success) {
            post.reloadReplies();
          } else {
            setErrorMessage(`Failed to delete reply: ${response.error}`);
          }
        } catch (error) {
          setErrorMessage(`Failed to delete reply: ${String(error)}`);
        }
        break;
      }
    }
  };

  const loadReplies = useCallback(async () => {
    if (!firebaseUser || post.variant !== "discussion") return;

    try {
      const token = await firebaseUser.getIdToken();
      const response = await getReplies(token, post.data._id);
      if (response.success) {
        setReplies(response.data);
      } else {
        setErrorMessage(`Failed to load replies: ${response.error}`);
      }
    } catch (error) {
      setErrorMessage(`Failed to load replies: ${String(error)}`);
    }
  }, [firebaseUser, post]);

  useEffect(() => {
    void loadReplies();
  }, [firebaseUser, post, loadReplies]);

  return (
    <div className={styles.announcementContainer}>
      <div className={styles.topRow}>
        <div className={styles.topLeft}>
          <ProfilePicture size="small" user={post.data.userId} />
          <div className={styles.authorColumn}>
            <p className={styles.authorName}>
              {post.data.userId.personal.firstName} {post.data.userId.personal.lastName}
            </p>
            <p className={styles.recipients}>
              {post.variant === "announcement"
                ? `Sent to ${
                    post.data.recipients[0] === "everyone"
                      ? "Everyone"
                      : post.data.recipients.join(", ")
                  } • `
                : ""}
              Posted {moment(post.data.createdAt).format("MMMM D YYYY, h:mm:ss A")}
            </p>
          </div>
        </div>
        {showDotsMenu && (
          <button
            className={styles.threeDotsButton}
            onClick={() => {
              setMenuOpen(!menuOpen);
            }}
          >
            <Image src="/icons/three_dots.svg" alt="Three dots menu" width={6} height={24} />
          </button>
        )}
      </div>

      {(post.variant === "announcement" || post.variant === "discussion") && (
        <h2 className={styles.announcementTitle}>{post.data.title}</h2>
      )}
      {editReplyComposerOpen && post.variant === "reply" ? (
        <ReplyComposer
          postId={post.data.postId}
          reply={post.data}
          onExit={() => {
            setEditReplyComposerOpen(false);
          }}
          reloadReplies={post.reloadReplies}
        />
      ) : (
        <p className={styles.announcementBody}>{post.data.message}</p>
      )}

      {post.variant === "discussion" && (
        <>
          {newReplyComposerOpen ? (
            <ReplyComposer
              postId={post.data._id}
              onExit={() => {
                setNewReplyComposerOpen(false);
              }}
              reloadReplies={loadReplies}
            />
          ) : (
            <Button
              className={styles.replyButton}
              label="Reply"
              onClick={() => {
                setNewReplyComposerOpen(true);
              }}
            />
          )}
          <div className={styles.repliesDivider} />
          <div className={styles.repliesContainer}>
            {replies?.map((reply) => (
              <PostPageView
                key={reply._id}
                showDotsMenu={reply.userId._id === user?._id || isAdminOrSuperAdmin}
                post={{
                  variant: "reply",
                  data: reply,
                  reloadReplies: loadReplies,
                }}
              />
            ))}
          </div>
          {replies && replies.length === 0 && <p>No replies yet</p>}
        </>
      )}

      {menuOpen && (
        <div className={styles.menuContainer}>
          {post.variant === "reply" ? (
            <Button
              className={styles.menuButton}
              label="Edit"
              variant="primary"
              onClick={() => {
                setMenuOpen(false);
                setEditReplyComposerOpen(true);
              }}
            />
          ) : (
            <a
              className="w-full"
              href={`/${post.variant === "announcement" ? "announcements" : "discussion"}/${post.data._id}/edit`}
            >
              <Button className={styles.menuButton} label="Edit" variant="primary" />
            </a>
          )}
          <Button
            className={styles.menuButton}
            label="Delete"
            variant="secondary"
            onClick={() => {
              setMenuOpen(false);
              setConfirmDeleteOpen(true);
            }}
          />
        </div>
      )}
      <TwoButtonPopup
        isOpen={confirmDeleteOpen}
        variant="warning"
        onCancel={() => {
          setConfirmDeleteOpen(false);
        }}
        onConfirm={() => {
          void handleDelete();
        }}
      >
        <p>Are you sure you want to delete this {post.variant}?</p>
      </TwoButtonPopup>
      {errorMessage && <div className="text-red-500">{errorMessage}</div>}
    </div>
  );
};
