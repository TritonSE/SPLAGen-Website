"use client";
import Image from "next/image";
import { useTranslation } from "react-i18next";

import styles from "./Step.module.css";

type StepProps = {
  step: string;
  index: number;
  caseType: "done" | "current" | "pending";
  isLast: boolean;
};

export const Step: React.FC<StepProps> = ({ step, index, caseType, isLast }) => {
  let icon, iconStyle, textStyle;
  const { t } = useTranslation();

  switch (caseType) {
    case "done":
      icon = <Image src="/icons/check.svg" alt="Completed" width={24} height={24} />;
      iconStyle = styles.done;
      textStyle = styles.doneText;
      break;
    case "current":
      icon = index + 1;
      iconStyle = styles.current;
      textStyle = styles.currentText;
      break;
    case "pending":
      icon = index + 1;
      iconStyle = styles.pending;
      textStyle = styles.pendingText;
      break;
  }

  return (
    <div className={styles.stepContainer}>
      <div className={styles.iconContainer}>
        <div className={`${styles.stepIcon} ${iconStyle}`}>{icon}</div>
        {!isLast && <div className={styles.stepLine}></div>}
      </div>
      <div className={`${styles.stepText} ${textStyle}`}>{t(step)}</div>
    </div>
  );
};
