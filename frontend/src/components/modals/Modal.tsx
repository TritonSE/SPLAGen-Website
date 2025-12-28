import Image from "next/image";
import { ReactNode, useEffect } from "react";

import { Button } from "..";

import styles from "./Modal.module.css";

import ExitButton from "@/../public/icons/ExitButton.svg";

const ExitButtonSrc: string = ExitButton as unknown as string;

export const Modal = ({
  title,
  content,
  isOpen,
  onClose,
  onSave,
}: {
  title: string;
  content: ReactNode;
  isOpen: boolean;
  onClose: () => void;
  onSave: () => unknown;
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  return isOpen ? (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContainer}>
        <button className={styles.closeButton} onClick={onClose}>
          <Image src={ExitButtonSrc} alt="Exit" />
        </button>
        <h2 className={styles.modalHeader}>{title}</h2>
        {content}

        <div className={styles.buttonsRow}>
          <Button variant="secondary" label="Cancel" onClick={onClose} />
          <Button label="Save" onClick={onSave} />
        </div>
      </div>
    </div>
  ) : null;
};
