import React from "react";

import styles from "./PillButton.module.css";

type PillButtonProps = {
  label: string;
  isActive: boolean;
  onClick: () => void;
  className?: string;
  icon?: React.ReactNode;
};

export const PillButton = ({ label, isActive, onClick, className, icon }: PillButtonProps) => {
  return (
    <button
      type="button"
      className={`${styles.pillbutton} ${className ?? ""} ${isActive ? styles.active : ""}`}
      onClick={onClick}
    >
      {label}
      {icon}
    </button>
  );
};
