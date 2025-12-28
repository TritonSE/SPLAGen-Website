import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useContext, useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
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
  const { firebaseUser } = useContext(UserContext);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ReplyFormData>({ resolver: zodResolver(replySchema) });
  const [errorMessage, setErrorMessage] = useState("");

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

      try {
        setErrorMessage("");
        const token = await firebaseUser.getIdToken();

        if (reply) {
          const result = await updateReply(token, reply._id, data.message);

          if (result.success && result.data._id) {
            reset();
            reloadReplies();
            onExit();
          } else {
            setErrorMessage(
              `Failed to update reply: ${result.success ? JSON.stringify(result.data) : result.error}`,
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
              `Failed to create reply: ${result.success ? JSON.stringify(result.data) : result.error}`,
            );
          }
        }
      } catch (error) {
        setErrorMessage(`Failed to ${reply ? "update" : "create"} reply: ${String(error)}`);
      }
    },
    [reset, firebaseUser, onExit, postId, reloadReplies, reply],
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
        placeholder="Reply..."
      />
      <p className={styles.errorMessage}>{errors.message?.message ?? "\u00A0"}</p>
      <div className={styles.buttonsRow}>
        <Button
          className={styles.button}
          type="button"
          label="Cancel"
          variant="secondary"
          onClick={onExit}
        />
        <Button className={styles.button} type="submit" label={reply ? "Save" : "Reply"} />
      </div>
      {errorMessage && <div className="text-red-500">{errorMessage}</div>}
    </form>
  );
};
