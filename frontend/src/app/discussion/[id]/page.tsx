"use client";

import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useCallback, useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import styles from "./page.module.css";

import {
  Discussion,
  getIndividualPost,
  subscribeToDiscussion,
  unsubscribeFromDiscussion,
} from "@/api/discussion";
import { PostPageView } from "@/components/PostPageView";
import { SuccessMessage } from "@/components/SuccessMessage";
import { UserContext } from "@/contexts/userContext";
import { useRedirectToLoginIfNotSignedIn } from "@/hooks/useRedirection";

const DiscussionPostDetailPage = () => {
  const { t } = useTranslation();
  useRedirectToLoginIfNotSignedIn();
  const params = useParams();

  const { firebaseUser, user, isAdminOrSuperAdmin } = useContext(UserContext);
  const [errorMessage, setErrorMessage] = useState("");
  const [post, setPost] = useState<Discussion | null>(null);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [subscriptionLoading, setSubscriptionLoading] = useState(false);
  const [subscriptionError, setSubscriptionError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const loadPost = useCallback(async () => {
    if (!firebaseUser || !params.id) return;

    try {
      const token = await firebaseUser.getIdToken();
      const response = await getIndividualPost(token, params.id as string);
      if (response.success) {
        setPost(response.data);
        setIsSubscribed(response.data.isSubscribed ?? false);
      } else {
        setErrorMessage(`${t("failed-to-retrieve-discussion-post")}: ${response.error}`);
      }
    } catch (error) {
      setErrorMessage(`${t("failed-to-retrieve-discussion-post")}: ${String(error)}`);
    }
  }, [firebaseUser, params, t]);

  const handleSubscriptionToggle = useCallback(async () => {
    if (!firebaseUser || !params.id) return;

    setSubscriptionError("");
    setSuccessMessage("");
    setSubscriptionLoading(true);

    try {
      const token = await firebaseUser.getIdToken();
      const response = isSubscribed
        ? await unsubscribeFromDiscussion(token, params.id as string)
        : await subscribeToDiscussion(token, params.id as string);

      if (response.success) {
        setIsSubscribed(response.data.isSubscribed);
        setSuccessMessage(
          response.data.isSubscribed
            ? t("successfully-subscribed")
            : t("successfully-unsubscribed"),
        );
      } else {
        setSubscriptionError(`${t("failed-to-update-subscription")}: ${response.error}`);
      }
    } catch (error) {
      setSubscriptionError(`${t("failed-to-update-subscription")}: ${String(error)}`);
    } finally {
      setSubscriptionLoading(false);
    }
  }, [firebaseUser, params, isSubscribed, t]);

  useEffect(() => {
    void loadPost();
  }, [firebaseUser, params, loadPost]);

  return (
    <div className={styles.pageContainer}>
      <h1 className={styles.title}>{t("discussion")}</h1>
      <Link href="/discussion" className={styles.backButton}>
        <ChevronLeft />
        {t("back")}
      </Link>

      {post && (
        <>
          <PostPageView
            showDotsMenu={post.userId._id === user?._id || isAdminOrSuperAdmin}
            post={{ variant: "discussion", data: post, onReplyPosted: loadPost }}
          />
          <div className={styles.subscriptionContainer}>
            <label className={styles.subscriptionLabel}>
              <input
                type="checkbox"
                checked={isSubscribed}
                onChange={() => void handleSubscriptionToggle()}
                disabled={subscriptionLoading}
                className={styles.subscriptionCheckbox}
              />
              <span>{t("subscribe-email-notifications")}</span>
            </label>
            {subscriptionLoading && <span className={styles.loadingText}>{t("updating")}</span>}
            {subscriptionError && <div className="text-red-500">{subscriptionError}</div>}
          </div>
        </>
      )}

      {errorMessage && <div className="text-red-500">{errorMessage}</div>}
      {successMessage && (
        <SuccessMessage
          message={successMessage}
          onDismiss={() => {
            setSuccessMessage("");
          }}
        />
      )}
    </div>
  );
};

export default DiscussionPostDetailPage;
