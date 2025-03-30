"use client";

import React, { useState } from "react";

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
      confirmLabel="Deny Request"
      onConfirm={onConfirm}
      onCancel={onCancel}
    >
      <p className={styles.title}>
        {" "}
        Are you sure you want to deny <strong>{user.name}</strong>’s request?
      </p>
      <p className={styles.message}>
        This action is irreversible. They will remain part of the counselor database but will not
        appear in the directory. To be added, they will need to submit a new request.
      </p>

      <div className={styles.noteContainer}>
        <label className={styles.label} htmlFor="reason">
          Send a note to: ({user.email})
        </label>
        <textarea
          value={reason}
          onChange={(e) => {
            setReason(e.target.value);
          }}
          placeholder="Let them know why"
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
  // onConfirm,
}: {
  user: { name: string; userId: string };
  isOpen: boolean;
  onCancel: () => void;
  // onConfirm: () => void;
}) => {
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
      confirmLabel="Approve Request"
      onConfirm={onConfirm}
      onCancel={onCancel}
    >
      <p className={styles.title}>
        {" "}
        Approve <strong>{user.name}</strong>’s request to be part of the directory?
      </p>
      <p className={styles.message}>
        The counselor will be approved and added to the directory. Any future updates will require
        manual update.
      </p>
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
      confirmLabel="Send Invite"
      onConfirm={onConfirm}
      onCancel={onCancel}
    >
      <p className={styles.title}>
        {" "}
        Invite <strong>{user.name}</strong> to be an admin?
      </p>
      <p className={styles.message}>
        They’ll have access to manage counselors, create announcements, and moderating
        discussions.{" "}
      </p>
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
      confirmLabel="Remove Admin"
      onConfirm={onConfirm}
      onCancel={onCancel}
    >
      <p className={styles.title}>
        {" "}
        Are you sure you want to remove <strong>{user.name}</strong> as an admin?
      </p>
      <p className={styles.message}>
        {user.name} will remain as a genetic counselor but will lose all admin privileges. To make
        her an admin again, you will have to resend an invitation.
      </p>

      <div className={styles.noteContainer}>
        <label className={styles.label} htmlFor="reason">
          Send a note to: ({user.email})
        </label>
        <textarea
          value={reason}
          onChange={(e) => {
            setReason(e.target.value);
          }}
          placeholder="Let them know why"
          className={styles.textarea}
        />
      </div>
    </TwoButtonPopup>
  );
};
