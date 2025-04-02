"use client";

import { useStateMachine } from "little-state-machine";
import Image from "next/image";
import React from "react";

import styles from "./Step3A.module.css";

import { onboardingState } from "@/state/stateTypes";

type Step3AProps = {
  onNext: (data: onboardingState["data"]) => void;
  onBack: () => void;
};

export const Step3A: React.FC<Step3AProps> = ({ onNext, onBack }) => {
  const { state } = useStateMachine();
  const membershipType = state.onboardingForm.membership;

  let membershipText = "";

  switch (membershipType) {
    case "Student":
      membershipText = "a Student";
      break;
    case "Healthcare Professional":
      membershipText = "a Healthcare Professional";
      break;
    default:
        membershipText = "an Associate Member";
  }

  const handleContinue = () => {
    onNext(state.onboardingForm);
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.welcome}>Welcome to SPLAGen!</h2>
      
      <div className={styles.iconContainer}>
        <Image 
          src="/icons/ic_round-check-box.svg"
          alt="Checkbox icon"
          width={81}
          height={81}
        />
      </div>

      <p className={styles.text}>
        You are being added to SPLAGen&apos;s full membership as {" "}
        <span className={styles.membershipCategory}>{membershipText}</span>.
      </p>

      <div className={styles.buttonContainer}>
        <button type="button" onClick={onBack} className={styles.backButton}>
          Back
        </button>
        <button type="button" onClick={handleContinue} className={styles.continueButton}>
          Continue
        </button>
      </div>
    </div>
  );
};