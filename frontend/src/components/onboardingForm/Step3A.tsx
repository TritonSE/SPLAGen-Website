"use client";

import { useStateMachine } from "little-state-machine";
import React from "react";

type Step3AProps = {
  onNext: () => void;
  onBack: () => void;
};

export const Step3A: React.FC<Step3AProps> = ({ onNext, onBack }) => {
  const { state } = useStateMachine();
  const membershipType = state.onboardingForm.membership; // Assuming field4 stores membership type

  let membershipText = "";

  switch (membershipType) {
    case "Student":
      membershipText = "a Student";
      break;
    case "Associate Member":
      membershipText = "an Associate Member";
      break;
    default:
        membershipText = "a Healthcare Professional";
  }

  const handleContinue = () => {
    onNext();
  };

  return (
    <div className="space-y-4">
      <h2>Welcome to SPLAGen!</h2>

      <p>You are being added to SPLAGEN&apos;s full membership as {membershipText}.</p>

      <div className="flex justify-between">
        <button type="button" onClick={onBack} className="px-4 py-2 bg-gray-500 text-white rounded">
          Back
        </button>
        <button type="button" onClick={handleContinue} className="px-4 py-2 bg-blue-500 text-white rounded">
          Continue
        </button>
      </div>
    </div>
  );
};