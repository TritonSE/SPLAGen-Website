import { ReactNode } from "react";

import styles from "./Button.module.css";

export type ButtonProps = {
  variant?: "primary" | "secondary";
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
  label: string;
  type?: "button" | "submit" | "reset";
  icon?: ReactNode;
};

export const Button = ({
  variant = "primary",
  disabled,
  onClick,
  className,
  label,
  type = "button",
  icon,
}: ButtonProps) => {
  return (
    <button
      className={`${styles.button} ${styles[variant]} ${className ?? ""}`}
      disabled={disabled}
      onClick={onClick}
      aria-label={label}
      type={type}
    >
      {label}
      {icon && <span className={styles.icon}>{icon}</span>}
    </button>
  );
};
