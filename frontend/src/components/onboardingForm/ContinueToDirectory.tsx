import { FC } from "react";

import styles from "./ContinueToDirectory.module.css";

import { Button } from "@/components/Button";

type ContinueToDirectoryProps = {
  onYes: () => unknown;
  onNo: () => unknown;
};

export const ContinueToDirectory: FC<ContinueToDirectoryProps> = ({ onYes, onNo }) => {
  return (
    <div className={styles.darkContainer}>
      <div className={styles.container}>
        <h2 className={styles.welcome}>Next Steps</h2>

        <p className={styles.text}>Would you like to be included in our directory?</p>

        <div className={styles.buttonContainer}>
          <Button onClick={onNo} label="No" variant="secondary" />

          <Button onClick={onYes} label="Yes" />
        </div>
      </div>
    </div>
  );
};
