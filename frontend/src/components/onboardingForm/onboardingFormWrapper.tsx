"use client";

import { useStateMachine } from "little-state-machine";
import { useCallback, useState } from "react";

import { onboardingState } from "../../state/stateTypes";
import updateOnboardingForm from "../../state/updateOnboardingForm";

import { Result, Step1, Step2, Step3A, Step3B } from ".";

export const OnboardingFormWrapper = () => {
  const [step, setStep] = useState(1);
  const { actions } = useStateMachine({ actions: { updateOnboardingForm } });

  const handleNext = useCallback(
    (data: onboardingState["data"]) => {
      actions.updateOnboardingForm(data);

      setStep((prevStep) => {
        if (prevStep === 2) {
          return prevStep + 2;
        } else if (prevStep === 3) {
          return prevStep + 2;
        } else {
          return prevStep + 1;
        }
      });
    },
    [actions.updateOnboardingForm, setStep],
  );

  const handleBack = useCallback(() => {
    setStep((prev) => Math.max(1, prev - 1));
  }, [setStep]);

  const handleReset = useCallback(() => {
    actions.updateOnboardingForm({
      professionalTitle: "",
      country: "",
      languages: [],
    });
    setStep(1);
  }, [actions.updateOnboardingForm, setStep]);

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
