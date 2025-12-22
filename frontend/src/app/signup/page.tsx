"use client";

import { useStateMachine } from "little-state-machine";
import { useRouter } from "next/navigation";
import { useCallback, useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { SuccessMessage } from "@/components/SuccessMessage";
import {
  Associate,
  Basics,
  Category,
  ContinueToDirectory,
  Questionnaire,
  SignUp,
  Student,
} from "@/components/onboardingForm";
import { UserContext } from "@/contexts/userContext";
import { onboardingState } from "@/state/stateTypes";
import updateOnboardingForm from "@/state/updateOnboardingForm";

export default function OnboardingForm() {
  const [step, setStep] = useState(0);
  const [registrationStatus, setRegistrationStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");
  const { state, actions } = useStateMachine({ actions: { updateOnboardingForm } });
  const { setOnboardingStep } = useContext(UserContext);
  const router = useRouter();
  const { t } = useTranslation();
  const [successMessage, setSuccessMessage] = useState("");

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
      professionalTitleOther: "",
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

  // Handle registration status changes
  const handleRegistrationStatusChange = useCallback(
    (status: "idle" | "submitting" | "success" | "error") => {
      setRegistrationStatus(status);

      // If registration is successful, redirect to home page
      if (status === "success") {
        // Professional & healthcare members can be added to the directory
        if (
          state.onboardingForm.membership === '"Genetic Counselor' ||
          state.onboardingForm.membership === "Healthcare Professional"
        ) {
          setStep(4);
        } else {
          setSuccessMessage("Registration submitted");
          setTimeout(() => {
            router.push("/");
          }, 2000);
        }
      }
    },
    [router, setRegistrationStatus, state.onboardingForm.membership],
  );

  // Show feedback message for registration
  const renderRegistrationMessage = () => {
    if (registrationStatus === "submitting") {
      return (
        <div className="absolute inset-0 bg-white bg-opacity-90 flex items-center justify-center z-10">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-xl font-medium">{t("processing-registration")}</p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="relative w-full h-full">
      {renderRegistrationMessage()}

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
          onReset={handleReset}
          onStatusChange={handleRegistrationStatusChange}
        />
      )}

      {step === 4 && (
        <ContinueToDirectory
          onNo={() => {
            router.push("/");
          }}
          onYes={() => {
            router.push("/directoryForm");
          }}
        />
      )}

      <SuccessMessage
        message={successMessage}
        onDismiss={() => {
          setSuccessMessage("");
        }}
      />
    </div>
  );
}
