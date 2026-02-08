import Image from "next/image";
import { ReactNode } from "react";
import { useTranslation } from "react-i18next";

import styles from "./styles.module.css";

type ProfileCardField = {
  label: string;
  value: string | ReactNode;
};

type ProfilePageCardProps = {
  title: string;
  onClickEdit: () => unknown;
  leftColumnFields: ProfileCardField[];
  rightColumnFields: ProfileCardField[];
};

export const ProfilePageCard = ({
  title,
  onClickEdit,
  leftColumnFields,
  rightColumnFields,
}: ProfilePageCardProps) => {
  const { t } = useTranslation();

  return (
    <div className={styles.infoCard}>
      <header>
        <h2>{title}</h2>
        <button className={styles.editButton} onClick={onClickEdit}>
          <Image src="/icons/line-md.svg" width={20} height={20} alt="Edit" />
        </button>
      </header>

      <section className={styles.profileDetails}>
        {[leftColumnFields, rightColumnFields].map((fields, index) => (
          <article key={index} className={styles.infoColumn}>
            {fields.map(({ label, value }) => (
              <div key={label}>
                <label className={styles.infoLabel}>{label}</label> <br />
                {value ?? t("none")}
              </div>
            ))}
          </article>
        ))}
      </section>
    </div>
  );
};
