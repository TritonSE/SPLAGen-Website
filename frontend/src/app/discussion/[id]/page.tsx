"use client";

import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useCallback, useContext, useEffect, useState } from "react";

import styles from "./page.module.css";

import { Discussion, getIndividualPost } from "@/api/discussion";
import { PostPageView } from "@/components/PostPageView";
import { UserContext } from "@/contexts/userContext";
import { useRedirectToLoginIfNotSignedIn } from "@/hooks/useRedirection";

const DiscussionPostDetailPage = () => {
  useRedirectToLoginIfNotSignedIn();
  const params = useParams();

  const { firebaseUser, user, isAdminOrSuperAdmin } = useContext(UserContext);
  const [errorMessage, setErrorMessage] = useState("");
  const [post, setPost] = useState<Discussion | null>(null);

  const loadPost = useCallback(async () => {
    if (!firebaseUser || !params.id) return;

    try {
      const token = await firebaseUser.getIdToken();
      const response = await getIndividualPost(token, params.id as string);
      if (response.success) {
        setPost(response.data);
      } else {
        setErrorMessage(`Failed to retrieve discussion post: ${response.error}`);
      }
    } catch (error) {
      setErrorMessage(`Failed to retrieve discussion post: ${String(error)}`);
    }
  }, [firebaseUser, params]);

  useEffect(() => {
    void loadPost();
  }, [firebaseUser, params, loadPost]);

  return (
    <div className={styles.pageContainer}>
      <h1 className={styles.title}>Discussion</h1>
      <Link href="/discussion" className={styles.backButton}>
        <ChevronLeft />
        Back
      </Link>

      {post && (
        <PostPageView
          showDotsMenu={post.userId._id === user?._id || isAdminOrSuperAdmin}
          post={{ variant: "discussion", data: post }}
        />
      )}

      {errorMessage && <div className="text-red-500">{errorMessage}</div>}
    </div>
  );
};

export default DiscussionPostDetailPage;
