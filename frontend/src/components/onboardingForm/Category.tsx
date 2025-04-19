"use client";

import { useStateMachine } from "little-state-machine";
import Image from "next/image";
import { useCallback, useMemo } from "react";

import styles from "./Category.module.css";

import { Button } from "@/components/Button";
import { onboardingState } from "@/state/stateTypes";

type CategoryProps = {
  onNext: (data: onboardingState["data"]) => void;
  onBack: () => void;
};

export const Category: React.FC<CategoryProps> = ({ onNext, onBack }) => {
  const { state } = useStateMachine();
  const membershipType = state.onboardingForm.membership;

  const [article, membershipText] = useMemo(() => {
    switch (membershipType) {
      case "Student":
        return ["a", "Student"];
      case "Healthcare Professional":
        return ["a", "Healthcare Professional"];
      case "Genetic Counselor":
        return ["a", "Genetic Counselor"];
      default:
        return ["an", "Associate Member"];
    }
  }, [membershipType]);

  const handleContinue = useCallback(() => {
    onNext(state.onboardingForm);
  }, [state, onNext]);

  return (
    <div className={styles.darkContainer}>
      <div className={styles.container}>
        <h2 className={styles.welcome}>Welcome to SPLAGen!</h2>

        <div className={styles.iconContainer}>
          <Image src="/icons/ic_success.svg" alt="Checkbox icon" width={81} height={81} />
        </div>

        <p className={styles.text}>
          You are being added to SPLAGen&apos;s full membership as {article}{" "}
          <span className={styles.membershipCategory}>{membershipText}</span>.
        </p>

        <div className={styles.buttonContainer}>
          <button type="button" onClick={onBack} className={styles.backButton}>
            <Image src="/icons/ic_caretleft.svg" alt="Back Icon" width={24} height={24} />
            Back
          </button>
          <Button onClick={handleContinue} label="Continue" />
        </div>
      </div>
    </div>
  );
};
