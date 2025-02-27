"use client";

import { useStateMachine } from "little-state-machine";

import updateOnboardingForm from "../../state/updateOnboardingForm";

type ResultProps = {
  onReset: () => void;
};

export const Result = ({ onReset }: ResultProps) => {
  const { state } = useStateMachine({ actions: { updateOnboardingForm } });

  return (
    <div>
      <h2 className="text-xl font-bold">Form Submission Result</h2>
      <p>
        <strong>Professional Title:</strong> {state.onboardingForm.professionalTitle}
      </p>
      <p>
        <strong>Country:</strong> {state.onboardingForm.country}
      </p>
      <p>
        <strong>Field1:</strong> {state.onboardingForm.field1}
      </p>
      <button type="button" onClick={onReset}>Back</button>
    </div>
  );
};
