import Image from "next/image";
import React from "react";

import styles from "./CheckMark.module.css"; // Import the CSS module

type CheckmarkProps = {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
};

export const Checkmark: React.FC<CheckmarkProps> = ({ checked, onChange, label }) => {
  const checkedIcon = "/icons/ic_round-check-box.svg";
  const uncheckedIcon = "/icons/ic_round-check-box-outline-blank.svg";

  return (
    <div
      onClick={() => {
        onChange(!checked);
      }}
      className={styles.checkmarkContainer} // Apply className instead of inline styles
    >
      <Image
        src={checked ? checkedIcon : uncheckedIcon}
        alt={checked ? "Checked" : "Unchecked"}
        width={24}
        height={24}
      />
      <span className={styles.checkmarkLabel}>{label}</span>
    </div>
  );
};
