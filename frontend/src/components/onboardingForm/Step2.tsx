"use client";

import { useStateMachine } from "little-state-machine";
import { useCallback } from "react";

import { onboardingState } from "@/state/stateTypes";
import updateOnboardingForm from "@/state/updateOnboardingForm";

type Step2Props = {
  onNext: (data: onboardingState["data"]) => void;
  onBack: () => void;
};

export const Step2 = ({ onNext, onBack }: Step2Props) => {
  const { state, actions } = useStateMachine({ actions: { updateOnboardingForm } });

  const handleSelection = useCallback(
    (answer: "yes" | "no") => {
      const updatedData = { ...state.onboardingForm, field1: answer };
      actions.updateOnboardingForm(updatedData);
      onNext(updatedData);
    },
    [state.onboardingForm, actions, onNext],
  );

  return (
    <div className="space-y-4">
      <h2>Step 2 - Select Yes or No</h2>
      <div className="space-y-2">
        <label className="block">Do you want to proceed?</label>
        <div className="flex gap-4">
          <button
            type="button"
            className="px-4 py-2 rounded"
            onClick={() => {
              handleSelection("yes");
            }}
          >
            Yes
          </button>
          <button
            type="button"
            className="px-4 py-2 rounded"
            onClick={() => {
              handleSelection("no");
            }}
          >
            No
          </button>
        </div>
      </div>

      <div className="flex justify-between">
        <button type="button" onClick={onBack} className="px-4 py-2 bg-gray-500 text-white rounded">
          Back
        </button>
      </div>
    </div>
  );
};
