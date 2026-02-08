import Image from "next/image";

import styles from "./styles.module.css";

type ResourceCardProps = {
  iconSrc: string;
  label: string;
  href: string;
};

export const ResourceCard = ({ iconSrc, label, href }: ResourceCardProps) => {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer">
      <div className={styles.root}>
        <Image src={iconSrc} alt={label} width={80} height={70} />
        <p>{label}</p>
        <div className={styles.bottomPurple} />
      </div>
    </a>
  );
};
