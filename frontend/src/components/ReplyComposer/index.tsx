import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useContext, useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";

import { Button } from "..";

import styles from "./styles.module.css";

import { Reply, createReply, updateReply } from "@/api/reply";
import { UserContext } from "@/contexts/userContext";

const replySchema = z.object({
  message: z.string().min(1).max(500),
});
type ReplyFormData = z.infer<typeof replySchema>;

type ReplyComposerProps = {
  postId: string;
  reply?: Reply;
  onExit: () => unknown;
  reloadReplies: () => unknown;
};
export const ReplyComposer = ({ postId, reply, onExit, reloadReplies }: ReplyComposerProps) => {
  const { t } = useTranslation();
  const { firebaseUser } = useContext(UserContext);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ReplyFormData>({ resolver: zodResolver(replySchema) });
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (reply) {
      reset({
        message: reply.message,
      });
    }
  }, [reply, reset]);

  const onSubmit = useCallback<SubmitHandler<ReplyFormData>>(
    async (data) => {
      if (!firebaseUser) return;

      setErrorMessage("");
      setLoading(true);
      try {
        const token = await firebaseUser.getIdToken();

        if (reply) {
          const result = await updateReply(token, reply._id, data.message);

          if (result.success && result.data._id) {
            reset();
            reloadReplies();
            onExit();
          } else {
            setErrorMessage(
              `${t("failed-to-update-reply")}: ${result.success ? JSON.stringify(result.data) : result.error}`,
            );
          }
        } else {
          const result = await createReply(token, postId, data.message);

          if (result.success && result.data._id) {
            reset();
            reloadReplies();
            onExit();
          } else {
            setErrorMessage(
              `${t("failed-to-create-reply")}: ${result.success ? JSON.stringify(result.data) : result.error}`,
            );
          }
        }
      } catch (error) {
        setErrorMessage(
          `${t(reply ? "failed-to-update-reply" : "failed-to-create-reply")}: ${String(error)}`,
        );
      } finally {
        setLoading(false);
      }
    },
    [reset, firebaseUser, onExit, postId, reloadReplies, reply, t],
  );

  const handleFormSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      void handleSubmit(onSubmit)();
    },
    [handleSubmit, onSubmit],
  );

  return (
    <form onSubmit={handleFormSubmit} className={styles.root}>
      <textarea
        id="reply-message"
        className={styles.textAreaField}
        {...register("message")}
        placeholder={t("reply-placeholder")}
      />
      <p className={styles.errorMessage}>{errors.message?.message ?? "\u00A0"}</p>
      <div className={styles.buttonsRow}>
        <Button
          className={styles.button}
          type="button"
          label={t("cancel")}
          variant="secondary"
          onClick={onExit}
        />
        <Button
          className={styles.button}
          type="submit"
          label={loading ? t("loading") : reply ? t("save") : t("reply")}
          disabled={loading}
        />
      </div>
      {errorMessage && <div className="text-red-500">{errorMessage}</div>}
    </form>
  );
};
