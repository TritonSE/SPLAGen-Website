"use client";

import { useStateMachine } from "little-state-machine";
import { useCallback, useState } from "react";

import { Result, Step1, Step2, Step3A, Step3B } from "@/components/onboardingForm";
import { onboardingState } from "@/state/stateTypes";
import updateOnboardingForm from "@/state/updateOnboardingForm";

export default function OnboardingForm() {
  const [step, setStep] = useState(1);
  const { actions } = useStateMachine({ actions: { updateOnboardingForm } });

  const handleNext = useCallback(
    (data: onboardingState["data"]) => {
      actions.updateOnboardingForm(data);

      setStep((prevStep) => {
        if (prevStep === 2) {
          return data.field1 === "yes" ? 3 : 4;
        } else if (prevStep === 3) {
          return prevStep + 2;
        } else {
          return prevStep + 1;
        }
      });
    },
    [actions, setStep],
  );

  const handleBack = useCallback(() => {
    setStep((prev) => Math.max(1, prev - 1));
  }, [setStep]);

  const handleReset = useCallback(() => {
    actions.updateOnboardingForm({
      professionalTitle: "",
      country: "",
      field1: "",
    });
    setStep(1);
  }, [actions, setStep]);

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center min-h-screen">
      <main className="flex flex-col gap-8 row-start-2 items-center">
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
      </main>
    </div>
  );
}
