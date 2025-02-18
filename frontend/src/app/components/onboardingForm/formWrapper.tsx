"use client";

import { useStateMachine } from "little-state-machine";
import { useState } from "react";

import { onboardingState } from "../../../state/stateTypes";
import updateOnboardingForm from "../../../state/updateAction";

import { Result, Step1, Step2, Step3A, Step3B } from ".";

const FormWrapper = () => {
  const [step, setStep] = useState(1);
  const { actions } = useStateMachine({ actions: { updateOnboardingForm } });

  const handleNext = (data: onboardingState["data"]) => {
    actions.updateOnboardingForm(data);
    if (step === 2) {
      if (data.field1 === "yes") {
        setStep(3); // Go to Step3A
      } else {
        setStep(4); // Go to Step3B
      }
    } else if (step === 3) {
      setStep(step + 2);
    } else {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    setStep((prev) => Math.max(1, prev - 1));
  };

  const handleReset = () => {
    actions.updateOnboardingForm({
      professionalTitle: "",
      country: "",
      field1: "",
    });
    setStep(1);
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-md rounded">
      {step === 1 && <Step1 onNext={handleNext} />}
      {step === 2 && <Step2 onNext={handleNext} onBack={handleBack} />}
      {step === 3 && (
        <Step3A
          onNext={handleNext}
          onBack={() => {
            setStep(2);
          }}
        />
      )}
      {step === 4 && (
        <Step3B
          onNext={handleNext}
          onBack={() => {
            setStep(2);
          }}
        />
      )}
      {step === 5 && <Result onReset={handleReset} />}
    </div>
  );
};

export default FormWrapper;
