"use client";

import { useState } from "react";

import styles from "@/components/onboardingForm/Step2.module.css";

export const ExpandableSection = ({ title, content }: { title: string; content: string }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className={styles.expandableSection}>
      <div
        className={styles.expandableHeader}
        onClick={() => { setExpanded(!expanded); }}
      >
        <span className={styles.expandIcon}>{expanded ? "-" : "+"}</span>
        <h4 className={styles.expandableTitle}>{title}</h4>
      </div>
      {expanded && <div className={styles.expandableContent}><p>{content}</p></div>}
    </div>
  );
};