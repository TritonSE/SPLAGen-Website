"use client";

import React, { useContext, useState } from "react";
import { Trans, useTranslation } from "react-i18next";

import styles from "./ManageFlowPopup.module.css";
import { TwoButtonPopup } from "./TwoButtonPopup";

import { inviteAdmin, removeAdmins } from "@/api/admin";
import { approveDirectoryEntry, denyDirectoryEntry } from "@/api/directory";
import { User, deleteUser, formatUserFullName, removeUserFromDirectory } from "@/api/users";
import { SuccessMessage } from "@/components/SuccessMessage";
import { UserContext } from "@/contexts/userContext";

export const DenyDirectoryRequestPopup = ({
  users,
  isOpen,
  onCancel,
  onDeny,
}: {
  users: User[];
  isOpen: boolean;
  onCancel: () => void;
  onDeny: () => unknown;
}) => {
  const [reason, setReason] = useState("");
  const { t } = useTranslation();
  const { firebaseUser } = useContext(UserContext);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const onConfirm = async () => {
    if (!firebaseUser) return;

    setErrorMessage("");
    setSuccessMessage("");
    setLoading(true);

    try {
      const token = await firebaseUser.getIdToken();
      const response = await denyDirectoryEntry(
        token,
        users.map((user) => user._id),
        reason,
      );
      if (response.success) {
        setSuccessMessage(t("request-denied-successfully"));
        onDeny();
      } else {
        setErrorMessage(`${t("failed-deny-directory-request")}: ${response.error}`);
      }
    } catch (error) {
      setErrorMessage(`${t("failed-deny-directory-request")}: ${String(error)}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {isOpen ? (
        <TwoButtonPopup
          isOpen={true}
          variant="warning"
          confirmLabel="deny-request"
          onConfirm={onConfirm}
          onCancel={onCancel}
          loading={loading}
        >
          <p className={styles.title}>
            <Trans
              i18nKey="deny-request-question"
              values={{
                name:
                  users.length === 1
                    ? formatUserFullName(users[0])
                    : `${String(users.length)} members`,
              }}
              components={{ strong: <strong /> }}
            />
          </p>
          <p className={styles.message}>{t("deny-directory-action-warning")}</p>

          <div className={styles.noteContainer}>
            <label className={styles.label} htmlFor="reason">
              {t("send-note-to", {
                email:
                  users.length === 1 ? users[0].personal.email : `${String(users.length)} members`,
              })}
            </label>
            <textarea
              value={reason}
              onChange={(e) => {
                setReason(e.target.value);
              }}
              placeholder={t("let-them-know-why")}
              className={styles.textarea}
            />
          </div>
          {errorMessage && <div className="text-red-500">{errorMessage}</div>}
        </TwoButtonPopup>
      ) : null}
      <SuccessMessage
        message={successMessage}
        onDismiss={() => {
          setSuccessMessage("");
        }}
      />
    </>
  );
};

export const ApproveDirectoryRequestPopup = ({
  users,
  onCancel,
  onApprove,
  isOpen,
}: {
  users: User[];
  isOpen: boolean;
  onCancel: () => void;
  onApprove: () => unknown;
}) => {
  const { t } = useTranslation();
  const { firebaseUser } = useContext(UserContext);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const onConfirm = async () => {
    if (!firebaseUser) return;

    setErrorMessage("");
    setSuccessMessage("");
    setLoading(true);

    try {
      const token = await firebaseUser.getIdToken();
      const response = await approveDirectoryEntry(
        token,
        users.map((user) => user._id),
      );
      if (response.success) {
        setSuccessMessage(t("request-approved-successfully"));
        onApprove();
      } else {
        setErrorMessage(`${t("failed-approve-directory-request")}: ${response.error}`);
      }
    } catch (error) {
      setErrorMessage(`${t("failed-approve-directory-request")}: ${String(error)}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {isOpen ? (
        <TwoButtonPopup
          isOpen={true}
          variant="question"
          confirmLabel="approve-request"
          onConfirm={onConfirm}
          onCancel={onCancel}
          loading={loading}
        >
          <p className={styles.title}>
            <Trans
              i18nKey="approve-request-question"
              values={{
                name:
                  users.length === 1
                    ? formatUserFullName(users[0])
                    : `${String(users.length)} members`,
              }}
              components={{ strong: <strong /> }}
            />
          </p>
          <p className={styles.message}>
            {t(
              users.length === 1
                ? "approve-directory-action-warning"
                : "approve-multiple-directory-action-warning",
            )}
          </p>
          {errorMessage && <div className="text-red-500">{errorMessage}</div>}
        </TwoButtonPopup>
      ) : null}

      <SuccessMessage
        message={successMessage}
        onDismiss={() => {
          setSuccessMessage("");
        }}
      />
    </>
  );
};

export const ConfirmInviteAdminPopup = ({
  user,
  onCancel,
  onInvite,
  isOpen,
}: {
  user: User | null;
  isOpen: boolean;
  onCancel: () => void;
  onInvite: () => unknown;
}) => {
  const { t } = useTranslation();
  const { firebaseUser } = useContext(UserContext);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const onConfirm = async () => {
    if (!firebaseUser || !user) return;

    setErrorMessage("");
    setSuccessMessage("");
    setLoading(true);

    try {
      const token = await firebaseUser.getIdToken();
      const response = await inviteAdmin(token, user._id);
      if (response.success) {
        setSuccessMessage(t("admin-invited-successfully"));
        onInvite();
      } else {
        setErrorMessage(`${t("failed-invite-admin")}: ${response.error}`);
      }
    } catch (error) {
      setErrorMessage(`${t("failed-invite-admin")}: ${String(error)}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {isOpen && user ? (
        <TwoButtonPopup
          isOpen={true}
          variant="question"
          confirmLabel={"send-invite"}
          onConfirm={onConfirm}
          onCancel={onCancel}
          loading={loading}
        >
          <p className={styles.title}>
            <Trans
              i18nKey="invite-admin-question"
              values={{ name: formatUserFullName(user) }}
              components={{ strong: <strong /> }}
            />
          </p>
          <p className={styles.message}>{t("invite-admin-action-warning")}</p>
          {errorMessage && <div className="text-red-500">{errorMessage}</div>}
        </TwoButtonPopup>
      ) : null}
      <SuccessMessage
        message={successMessage}
        onDismiss={() => {
          setSuccessMessage("");
        }}
      />
    </>
  );
};

export const DeleteUserPopup = ({
  user,
  isOpen,
  onDelete,
  onCancel,
}: {
  user: User | null;
  isOpen: boolean;
  onCancel: () => void;
  onDelete: () => unknown;
}) => {
  const { t } = useTranslation();
  const [reason, setReason] = useState<string>("");
  const { firebaseUser } = useContext(UserContext);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const onConfirm = async () => {
    if (!firebaseUser || !user) return;

    setErrorMessage("");
    setSuccessMessage("");
    setLoading(true);

    try {
      const token = await firebaseUser.getIdToken();
      const response = await deleteUser(user._id, reason, token);
      if (response.success) {
        setSuccessMessage(t("user-deleted-successfully"));
        onDelete();
      } else {
        setErrorMessage(`${t("failed-delete-user")}: ${response.error}`);
      }
    } catch (error) {
      setErrorMessage(`${t("failed-delete-user")}: ${String(error)}`);
    } finally {
      setLoading(false);
    }
  };

  const userName = user ? formatUserFullName(user) : "";

  return (
    <>
      {isOpen && user ? (
        <TwoButtonPopup
          isOpen={true}
          variant="warning"
          confirmLabel="delete-user"
          onConfirm={onConfirm}
          onCancel={onCancel}
          loading={loading}
        >
          <p className={styles.title}>
            <Trans
              i18nKey="delete-user-question"
              values={{ name: userName }}
              components={{ strong: <strong /> }}
            />
          </p>
          <p className={styles.message}>{t("delete-user-warning")}</p>

          <div className={styles.noteContainer}>
            <label className={styles.label} htmlFor="reason">
              {t("send-note-to", { email: user.personal.email })}
            </label>
            <textarea
              value={reason}
              onChange={(e) => {
                setReason(e.target.value);
              }}
              placeholder={t("let-them-know-why")}
              className={styles.textarea}
            />
          </div>
          {errorMessage && <div className="text-red-500">{errorMessage}</div>}
        </TwoButtonPopup>
      ) : null}
      <SuccessMessage
        message={successMessage}
        onDismiss={() => {
          setSuccessMessage("");
        }}
      />
    </>
  );
};

export const RemoveFromDirectoryPopup = ({
  user,
  isOpen,
  onRemove,
  onCancel,
}: {
  user: User | null;
  isOpen: boolean;
  onCancel: () => void;
  onRemove: () => unknown;
}) => {
  const { t } = useTranslation();
  const [reason, setReason] = useState<string>("");
  const { firebaseUser } = useContext(UserContext);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const onConfirm = async () => {
    if (!firebaseUser || !user) return;

    setErrorMessage("");
    setSuccessMessage("");
    setLoading(true);

    try {
      const token = await firebaseUser.getIdToken();
      const response = await removeUserFromDirectory(user._id, reason, token);
      if (response.success) {
        setSuccessMessage(t("user-removed-from-directory-successfully"));
        onRemove();
      } else {
        setErrorMessage(`${t("failed-remove-from-directory")}: ${response.error}`);
      }
    } catch (error) {
      setErrorMessage(`${t("failed-remove-from-directory")}: ${String(error)}`);
    } finally {
      setLoading(false);
    }
  };

  const userName = user ? formatUserFullName(user) : "";

  return (
    <>
      {isOpen && user ? (
        <TwoButtonPopup
          isOpen={true}
          variant="warning"
          confirmLabel="admin-remove-from-directory"
          onConfirm={onConfirm}
          onCancel={onCancel}
          loading={loading}
        >
          <p className={styles.title}>
            <Trans
              i18nKey="admin-remove-from-directory-question"
              values={{ name: userName }}
              components={{ strong: <strong /> }}
            />
          </p>
          <p className={styles.message}>{t("admin-remove-from-directory-warning")}</p>

          <div className={styles.noteContainer}>
            <label className={styles.label} htmlFor="reason">
              {t("send-note-to", { email: user.personal.email })}
            </label>
            <textarea
              value={reason}
              onChange={(e) => {
                setReason(e.target.value);
              }}
              placeholder={t("let-them-know-why")}
              className={styles.textarea}
            />
          </div>
          {errorMessage && <div className="text-red-500">{errorMessage}</div>}
        </TwoButtonPopup>
      ) : null}
      <SuccessMessage
        message={successMessage}
        onDismiss={() => {
          setSuccessMessage("");
        }}
      />
    </>
  );
};

export const RemoveAdminPopup = ({
  users,
  isOpen,
  onRemove,
  onCancel,
}: {
  users: User[];
  isOpen: boolean;
  onCancel: () => void;
  onRemove: () => unknown;
}) => {
  const { t } = useTranslation();

  const [reason, setReason] = useState<string>("");
  const { firebaseUser } = useContext(UserContext);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const onConfirm = async () => {
    if (!firebaseUser) return;

    setErrorMessage("");
    setSuccessMessage("");
    setLoading(true);

    try {
      const token = await firebaseUser.getIdToken();
      const response = await removeAdmins(
        token,
        users.map((user) => user._id),
        reason,
      );
      if (response.success) {
        setSuccessMessage(t("admins-removed-successfully"));
        onRemove();
      } else {
        setErrorMessage(`${t("failed-remove-admins")}: ${response.error}`);
      }
    } catch (error) {
      setErrorMessage(`${t("failed-remove-admins")}: ${String(error)}`);
    } finally {
      setLoading(false);
    }
  };

  const adminNames =
    users.length === 1 ? formatUserFullName(users[0]) : `${String(users.length)} users`;

  return (
    <>
      {isOpen ? (
        <TwoButtonPopup
          isOpen={true}
          variant="warning"
          confirmLabel="remove-admin"
          onConfirm={onConfirm}
          onCancel={onCancel}
          loading={loading}
        >
          <p className={styles.title}>
            <Trans
              i18nKey="remove-admin-question"
              values={{
                name: adminNames,
              }}
              components={{ strong: <strong /> }}
            />
          </p>
          <p className={styles.message}>{t("remove-admin-action-warning", { name: adminNames })}</p>

          <div className={styles.noteContainer}>
            <label className={styles.label} htmlFor="reason">
              {t("send-note-to", {
                email:
                  users.length === 1 ? users[0].personal.email : `${String(users.length)} members`,
              })}
            </label>
            <textarea
              value={reason}
              onChange={(e) => {
                setReason(e.target.value);
              }}
              placeholder={t("let-them-know-why")}
              className={styles.textarea}
            />
          </div>
          {errorMessage && <div className="text-red-500">{errorMessage}</div>}
        </TwoButtonPopup>
      ) : null}
      <SuccessMessage
        message={successMessage}
        onDismiss={() => {
          setSuccessMessage("");
        }}
      />
    </>
  );
};
