"use client";

import { useStateMachine } from "little-state-machine";
import Image from "next/image";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";

import styles from "./Category.module.css";

import { Button } from "@/components/Button";

type CategoryProps = {
  // Called when the user clicks "Continue" to actually create their account.
  onContinue: () => void | Promise<void>;
  isSubmitting?: boolean;
  error?: string | null;
  // If provided, shows a back button that returns to the appropriate
  // previous step (e.g. the Student/Associate sub-form) instead of continuing.
  onBack?: () => void;
};

export const Category: React.FC<CategoryProps> = ({ onContinue, isSubmitting, error, onBack }) => {
  const { state } = useStateMachine();
  const { t } = useTranslation();

  const membershipType = state.onboardingForm.membership;

  const membershipText = useMemo(() => {
    switch (membershipType) {
      case "Student":
        return t("category-membership-student");
      case "Other Genetics Professional":
        return t("category-membership-other-genetics-professional");
      case "Healthcare Professional":
        return t("category-membership-healthcare");
      case "Genetic Counselor":
        return t("category-membership-genetic-counselor");
      default:
        return t("category-membership-associate");
    }
  }, [membershipType, t]);

  return (
    <div className={styles.darkContainer}>
      <div className={styles.container}>
        <h2 className={styles.welcome}>{t("category-welcome")}</h2>

        <div className={styles.iconContainer}>
          <Image src="/icons/ic_success.svg" alt="Checkbox icon" width={81} height={81} />
        </div>

        <p className={styles.text}>
          {t("category-membership-text")}{" "}
          <span className={styles.membershipCategory}>{membershipText}</span>.
        </p>

        {error && <p className={styles.errorText}>{error}</p>}

        <div className={styles.buttonContainer}>
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              className={styles.backButton}
              disabled={isSubmitting}
            >
              <Image src="/icons/ic_caretleft.svg" alt="Back Icon" width={24} height={24} />
              {t("back")}
            </button>
          )}

          <Button
            onClick={() => {
              void onContinue();
            }}
            disabled={isSubmitting}
            label={isSubmitting ? t("loading") : t("continue")}
          />
        </div>
      </div>
    </div>
  );
};
