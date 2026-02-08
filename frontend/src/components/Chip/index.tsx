import React from "react";

import styles from "./styles.module.css";

export const Chip = ({ text, color }: { text: string; color: string }) => {
  return (
    <div
      className={styles.root}
      style={{
        backgroundColor: color,
      }}
    >
      <p className={styles.text}>{text}</p>
    </div>
  );
};
