import { ArrowRight } from "lucide-react";
import Link from "next/link";

import styles from "./styles.module.css";

type MemberCountCardProps = {
  count: number;
  label: string;
  href: string;
};

export const MemberCountCard = ({ count, label, href }: MemberCountCardProps) => {
  return (
    <Link href={href}>
      <div className={styles.root}>
        <div className={styles.textColumn}>
          <h4 className={styles.countText}>{count}</h4>
          <p className={styles.labelText}>{label}</p>
        </div>
        <div className={styles.goButton}>
          <ArrowRight />
        </div>
      </div>
    </Link>
  );
};
