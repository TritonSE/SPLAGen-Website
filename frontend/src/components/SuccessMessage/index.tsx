import Image from "next/image";

import styles from "./styles.module.css";

import ExitButton from "@/../public/icons/WhiteExit.svg";

const ExitButtonSrc: string = ExitButton as unknown as string;

export const SuccessMessage = ({
  message,
  onDismiss,
}: {
  message: string;
  onDismiss: () => unknown;
}) => {
  return message ? (
    <div className={styles.root}>
      <p className={styles.text}>{message}</p>
      <button className={styles.closeButton} onClick={onDismiss}>
        <Image src={ExitButtonSrc} alt="Close" />
      </button>
    </div>
  ) : null;
};
