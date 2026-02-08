"use client";

import { useParams } from "next/navigation";
import { useCallback, useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { Discussion, getIndividualPost } from "@/api/discussion";
import { DiscussionForm } from "@/components/DiscussionForm";
import { UserContext } from "@/contexts/userContext";
import { useRedirectToLoginIfNotSignedIn } from "@/hooks/useRedirection";

const EditPostPage = () => {
  const { t } = useTranslation();
  useRedirectToLoginIfNotSignedIn();
  const params = useParams();

  const { firebaseUser } = useContext(UserContext);
  const [errorMessage, setErrorMessage] = useState("");
  const [post, setPost] = useState<Discussion>();

  const loadPost = useCallback(async () => {
    if (!firebaseUser || !params.id) return;

    try {
      const token = await firebaseUser.getIdToken();
      const response = await getIndividualPost(token, params.id as string);
      if (response.success) {
        setPost(response.data);
      } else {
        setErrorMessage(`${t("failed-to-retrieve-discussion-post")}: ${response.error}`);
      }
    } catch (error) {
      setErrorMessage(`${t("failed-to-retrieve-discussion-post")}: ${String(error)}`);
    }
  }, [firebaseUser, params, t]);

  useEffect(() => {
    void loadPost();
  }, [firebaseUser, params, loadPost]);

  return (
    <>
      <DiscussionForm post={post} />
      {errorMessage && <div className="text-red-500">{errorMessage}</div>}
    </>
  );
};

export default EditPostPage;
