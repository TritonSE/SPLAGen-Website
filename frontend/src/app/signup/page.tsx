"use client";

import { useStateMachine } from "little-state-machine";
import { useCallback, useContext, useEffect, useState } from "react";

import {
  Associate,
  Basics,
  Category,
  Questionnaire,
  Result,
  SignUp,
  Student,
} from "@/components/onboardingForm";
import { UserContext } from "@/contexts/userContext";
import { onboardingState } from "@/state/stateTypes";
import updateOnboardingForm from "@/state/updateOnboardingForm";

export default function OnboardingForm() {
  const [step, setStep] = useState(0);
  const { state, actions } = useStateMachine({ actions: { updateOnboardingForm } });
  const { setOnboardingStep } = useContext(UserContext);

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
    [actions, setStep],
  );

  const handleBack = useCallback(() => {
    setStep((prev) => Math.max(0, prev - 1));
  }, [setStep]);

  const handleReset = useCallback(() => {
    actions.updateOnboardingForm({
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      professionalTitle: { value: "", label: "" },
      country: { value: "", label: "" },
      languages: [],
    });
    setStep(0);
  }, [actions, setStep]);

  // Update the onboarding Progress stepper
  useEffect(() => {
    if (step === 0) {
      setOnboardingStep(0);
    } else if (step === 1) {
      setOnboardingStep(1);
    } else if (step === 2) {
      setOnboardingStep(2);
    }
  }, [step, setOnboardingStep]);

  // Special flow handlers for Student and Associate Member paths
  const handleStudentFlow = useCallback(() => {
    setStep(2.1); // Use decimal to represent the student sub-step
  }, [setStep]);

  const handleAssociateFlow = useCallback(() => {
    setStep(2.2);
  }, [setStep]);

  const continueFromIntermediateStep = useCallback(() => {
    setStep(3); // Go to Step3A after either intermediate step
  }, [setStep]);

  return (
    <div className=" relative w-full h-full">
      {step === 0 && <SignUp onNext={handleNext} />}
      {step === 1 && <Basics onBack={handleBack} onNext={handleNext} />}

      {step === 2 && (
        <Questionnaire
          onNext={handleNext}
          onBack={handleBack}
          onStudentFlow={handleStudentFlow}
          onAssociateFlow={handleAssociateFlow}
        />
      )}

      {step === 2.1 && (
        <Student
          onNext={continueFromIntermediateStep}
          onBack={() => {
            setStep(2);
          }}
        />
      )}

      {step === 2.2 && (
        <Associate
          onNext={continueFromIntermediateStep}
          onBack={() => {
            setStep(2);
          }}
        />
      )}

      {step === 3 && (
        <Category
          onNext={handleNext}
          onBack={() => {
            // If we're coming from an intermediate step, go back to Step2
            const membership = state.onboardingForm.membership;
            if (membership === "Student") {
              setStep(2.1);
            } else if (membership === "Associate Member") {
              setStep(2.2);
            } else {
              setStep(2);
            }
          }}
        />
      )}

      {step === 5 && <Result onReset={handleReset} />}
    </div>
  );
}
