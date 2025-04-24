"use client";

import Image from "next/image";
import { useState } from "react";

import styles from "@/components/expandable.module.css";

export const ExpandableSection = ({ title, content }: { title: string; content: string }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className={styles.expandableSection}>
      <div
        className={`${styles.expandableHeader} ${expanded ? styles.expandedHeader : ""}`}
        onClick={() => {
          setExpanded(!expanded);
        }}
      >
        <span className={styles.expandIcon}>
          {expanded ? (
            <Image src="/icons/ExitButton.svg" alt="Collapse" width={24} height={24} />
          ) : (
            <Image src="/icons/ic_add.svg" alt="Expand" width={24} height={24} />
          )}
        </span>
        <h4 className={styles.expandableTitle}>{title}</h4>
      </div>
      {expanded && (
        <div className={styles.expandableContent}>
          <p>{content}</p>
        </div>
      )}
    </div>
  );
};
