import { FC } from "react";
import { useTranslation } from "react-i18next";

import styles from "./ContinueToDirectory.module.css";

import { Button } from "@/components/Button";

type ContinueToDirectoryProps = {
  onYes: () => unknown;
  onNo: () => unknown;
};

export const ContinueToDirectory: FC<ContinueToDirectoryProps> = ({ onYes, onNo }) => {
  const { t } = useTranslation();

  return (
    <div className={styles.darkContainer}>
      <div className={styles.container}>
        <h2 className={styles.welcome}>{t("directory-next-steps")}</h2>

        <p className={styles.text}>{t("directory-question")}</p>

        <div className={styles.buttonContainer}>
          <Button onClick={onNo} label={t("no")} variant="secondary" />

          <Button onClick={onYes} label={t("yes")} />
        </div>
      </div>
    </div>
  );
};
