"use client";

import React, { useState } from "react";
import { Trans, useTranslation } from "react-i18next";

import styles from "./ManageFlowPopup.module.css";
import { TwoButtonPopup } from "./TwoButtonPopup";

export const DenyDirectoryRequestPopup = ({
  user,
  isOpen,
  onCancel,
}: {
  user: { name: string; userId: string; email: string };
  isOpen: boolean;
  onCancel: () => void;
}) => {
  const [reason, setReason] = useState<string>("");
  const { t } = useTranslation();
  const onConfirm = () => {
    //TODO send denyal to backend
    //TODO is reason required? if so/not update backend check
    console.log("Confirmed", reason);

    setReason("");
    onCancel();
  };

  if (!isOpen) return null;
  return (
    <TwoButtonPopup
      isOpen={true}
      variant="warning"
      confirmLabel="deny-request"
      onConfirm={onConfirm}
      onCancel={onCancel}
    >
      <p className={styles.title}>
        <Trans
          i18nKey="deny-request-question"
          values={{ name: user.name }}
          components={{ strong: <strong /> }}
        />
      </p>
      <p className={styles.message}>{t("deny-directory-action-warning")}</p>

      <div className={styles.noteContainer}>
        <label className={styles.label} htmlFor="reason">
          {t("send-note-to", { email: user.email })}
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
    </TwoButtonPopup>
  );
};

export const ApproveDirectoryRequestPopup = ({
  user,
  onCancel,
  isOpen,
}: {
  user: { name: string; userId: string };
  isOpen: boolean;
  onCancel: () => void;
}) => {
  const { t } = useTranslation();

  const onConfirm = () => {
    //TODO send request to backend
    console.log("Confirmed");
    onCancel();
  };

  if (!isOpen) return null;
  return (
    <TwoButtonPopup
      isOpen={true}
      variant="question"
      confirmLabel="approve-request"
      onConfirm={onConfirm}
      onCancel={onCancel}
    >
      <p className={styles.title}>
        <Trans
          i18nKey="approve-request-question"
          values={{ name: user.name }}
          components={{ strong: <strong /> }}
        />
      </p>
      <p className={styles.message}>{t("approve-directory-action-warning")}</p>
    </TwoButtonPopup>
  );
};

export const InviteAdminPopup = ({
  user,
  onCancel,
  isOpen,
}: {
  user: { name: string; userId: string };
  isOpen: boolean;
  onCancel: () => void;
}) => {
  const { t } = useTranslation();

  const onConfirm = () => {
    //TODO send request to backend
    console.log("Confirmed");
    onCancel();
  };

  if (!isOpen) return null;
  return (
    <TwoButtonPopup
      isOpen={true}
      variant="info"
      confirmLabel={"send-invite"}
      onConfirm={onConfirm}
      onCancel={onCancel}
    >
      <p className={styles.title}>
        <Trans
          i18nKey="invite-admin-question"
          values={{ name: user.name }}
          components={{ strong: <strong /> }}
        />
      </p>
      <p className={styles.message}>{t("invite-admin-action-warning")}</p>
    </TwoButtonPopup>
  );
};

export const RemoveAdminPopup = ({
  user,
  isOpen,
  onCancel,
}: {
  user: { name: string; userId: string; email: string };
  isOpen: boolean;
  onCancel: () => void;
}) => {
  const { t } = useTranslation();

  const [reason, setReason] = useState<string>("");
  const onConfirm = () => {
    //TODO send denyal to backend
    //TODO is reason required? if so/not update backend check
    console.log("Confirmed", reason);

    setReason("");
    onCancel();
  };

  if (!isOpen) return null;
  return (
    <TwoButtonPopup
      isOpen={true}
      variant="warning"
      confirmLabel="remove-admin"
      onConfirm={onConfirm}
      onCancel={onCancel}
    >
      <p className={styles.title}>
        <Trans
          i18nKey="remove-admin-question"
          values={{ name: user.name }}
          components={{ strong: <strong /> }}
        />
      </p>
      <p className={styles.message}>{t("remove-admin-action-warning", { name: user.name })}</p>

      <div className={styles.noteContainer}>
        <label className={styles.label} htmlFor="reason">
          {t("send-note-to", { email: user.email })}
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
    </TwoButtonPopup>
  );
};
