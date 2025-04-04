import { ReactNode } from "react";

import styles from "./Button.module.css";

export type ButtonProps = {
  variant: "primary" | "secondary";
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
  label: string;
  icon?: ReactNode;
};

export const Button = ({ variant, disabled, onClick, className, label, icon }: ButtonProps) => {
  return (
    <div className={className}>
      <button
        className={`${styles.button} ${styles[variant]} ${className ?? ""}`}
        disabled={disabled}
        onClick={onClick}
        aria-label={label}
      >
        {label}
        {icon && <span className={styles.icon}>{icon}</span>}
      </button>
    </div>
  );
};
