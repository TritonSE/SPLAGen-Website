"use client";

import { useStateMachine } from "little-state-machine";
import { useCallback, useState } from "react";

import { 
  Result, 
  Step1, 
  Step2, 
  Step2Associate, 
  Step2Student, 
  Step3A, 
} from "@/components/onboardingForm";
import { onboardingState } from "@/state/stateTypes";
import updateOnboardingForm from "@/state/updateOnboardingForm";

export default function OnboardingForm() {
  const [step, setStep] = useState(1);
  const { state, actions } = useStateMachine({ actions: { updateOnboardingForm } });

  const handleNext = useCallback(
    (data: onboardingState["data"]) => {
      actions.updateOnboardingForm(data);

      setStep((prevStep) => {
        if (prevStep === 3) {
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
      professionalTitle: {value: "", label: ""},
      country: {value: "", label: ""},
      languages: [],
    });
    setStep(1);
  }, [actions.updateOnboardingForm, setStep]);

  // Special flow handlers for Student and Associate Member paths
  const handleStudentFlow = useCallback(() => {
    setStep(2.1); // Use decimal to represent the student sub-step
  }, [setStep]);

  const handleAssociateFlow = useCallback(() => {
    setStep(2.2); // Use decimal to represent the associate sub-step
  }, [setStep]);

  // Determine next step based on membership type
  const continueFromIntermediateStep = useCallback(() => {
    setStep(3); // Go to Step3A after either intermediate step
  }, [setStep]);

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center min-h-screen">
      <main className="flex flex-col gap-8 row-start-2 items-center">
        <div className="max-w-md mx-auto p-6 bg-white shadow-md rounded">
          {step === 1 && <Step1 onNext={handleNext} />}
          
          {step === 2 && (
            <Step2 
              onNext={handleNext} 
              onBack={handleBack} 
              onStudentFlow={handleStudentFlow}
              onAssociateFlow={handleAssociateFlow}
            />
          )}
          
          {step === 2.1 && (
            <Step2Student
              onNext={continueFromIntermediateStep}
              onBack={() => {setStep(2)}}
            />
          )}
          
          {step === 2.2 && (
            <Step2Associate
              onNext={continueFromIntermediateStep}
              onBack={() => {setStep(2)}}
            />
          )}
          
          {step === 3 && (
            <Step3A
              onNext={handleNext}
              onBack={() => {
                // If we're coming from an intermediate step, go back to Step2
                const membership = state.onboardingForm.membership;
                if (membership === "Student" || membership === "Associate Member") {
                  setStep(2);
                } else {
                  setStep(2);
                }
              }}
            />
          )}
          
          {step === 5 && <Result onReset={handleReset} />}
        </div>
      </main>
    </div>
  );
}
