"use client";

import { useStateMachine } from "little-state-machine";
import { useCallback } from "react";

import { onboardingState } from "@/state/stateTypes";
import updateOnboardingForm from "@/state/updateOnboardingForm";
import styles from "./Step2.module.css";

type Step2Props = {
  onNext: (data: onboardingState["data"]) => void;
  onBack: () => void;
};

export const Step2 = ({ onNext, onBack }: Step2Props) => {
  const { state, actions } = useStateMachine({ actions: { updateOnboardingForm } });

  const handleSelection = useCallback(
    (answer: "yes" | "no") => {
      const updatedData = { ...state.onboardingForm, field1: answer }; // field1 not defined currently
      actions.updateOnboardingForm(updatedData);
      onNext(updatedData);
    },
    [state.onboardingForm, actions.updateOnboardingForm, onNext],
  );

  return (
    <div className={styles.container}>
      <form className={styles.form}>
        <div>
          <h2 className={styles.title}>Membership Questionnaire</h2>
        </div>

        <div>
          <p className={styles.subtitle}>
            Did you complete your genetic counseling training in an accredited masters program in
            the United States or a formal genetic counseling program in Latin America (either the
            Cuban or Brazilian genetic counseling masters programs)?
          </p>
        </div>

        <div className={styles.buttonGroup}>
          <button
            type="button"
            className={styles.optionButton}
            onClick={() => {
              handleSelection("yes");
            }}
          >
            Yes
          </button>
          <button
            type="button"
            className={styles.optionButton}
            onClick={() => {
              handleSelection("no");
            }}
          >
            No
          </button>
        </div>

        <div className={styles.navigation}>
          <button type="button" onClick={onBack} className={styles.backButton}>
            Back
          </button>
        </div>
      </form>
    </div>
  );
};
