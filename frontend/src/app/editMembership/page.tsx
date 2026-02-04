"use client";

import { useStateMachine } from "little-state-machine";
import { useRouter } from "next/navigation";
import { useCallback, useContext, useState } from "react";

import { SuccessMessage } from "@/components/SuccessMessage";
import {
  Associate,
  ContinueToDirectory,
  EditMembershipCategory,
  Questionnaire,
  Student,
} from "@/components/onboardingForm";
import { UserContext } from "@/contexts/userContext";
import { useRedirectToLoginIfNotSignedIn } from "@/hooks/useRedirection";
import { onboardingState } from "@/state/stateTypes";
import updateOnboardingForm from "@/state/updateOnboardingForm";

export default function EditMembershipPage() {
  useRedirectToLoginIfNotSignedIn();

  const router = useRouter();
  const { state, actions } = useStateMachine({ actions: { updateOnboardingForm } });
  const [step, setStep] = useState(0);
  const [updateStatus, setUpdateStatus] = useState<"idle" | "submitting" | "success" | "error">(
    "idle",
  );
  const [successMessage, setSuccessMessage] = useState("");
  const { user } = useContext(UserContext);

  const handleNext = useCallback(
    (data: onboardingState["data"]) => {
      actions.updateOnboardingForm(data);
      setStep((prevStep) => prevStep + 1);
    },
    [actions],
  );

  const handleStudentFlow = useCallback(() => {
    setStep(0.1); // Student sub-step
  }, []);

  const handleAssociateFlow = useCallback(() => {
    setStep(0.2); // Associate sub-step
  }, []);

  const continueFromIntermediateStep = useCallback(() => {
    setStep(1); // Go to confirmation step
  }, []);

  const handleUpdateStatusChange = useCallback(
    (status: "idle" | "submitting" | "success" | "error") => {
      setUpdateStatus(status);

      // If update is successful, check if eligible for directory
      if (status === "success") {
        if (
          (state.onboardingForm?.membership === "Genetic Counselor" ||
            state.onboardingForm?.membership === "Healthcare Professional") &&
          !user?.account.inDirectory
        ) {
          setStep(2);
        } else {
          setSuccessMessage("Membership updated successfully");
          router.push("/");
        }
      }
    },
    [router, state.onboardingForm?.membership, user?.account.inDirectory],
  );

  // Show loading overlay during submission
  const renderUpdateMessage = () => {
    if (updateStatus === "submitting") {
      return (
        <div className="absolute inset-0 bg-white bg-opacity-90 flex items-center justify-center z-10">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-xl font-medium">Updating membership...</p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="relative w-full h-full">
      {renderUpdateMessage()}

      {step === 0 && (
        <Questionnaire
          onNext={handleNext}
          onBack={() => {
            router.push("/profile");
          }}
          onStudentFlow={handleStudentFlow}
          onAssociateFlow={handleAssociateFlow}
        />
      )}

      {step === 0.1 && (
        <Student
          onNext={continueFromIntermediateStep}
          onBack={() => {
            setStep(0);
          }}
        />
      )}

      {step === 0.2 && (
        <Associate
          onNext={continueFromIntermediateStep}
          onBack={() => {
            setStep(0);
          }}
        />
      )}

      {step === 1 && (
        <EditMembershipCategory
          onNext={() => {
            setStep(2);
          }}
          onBack={() => {
            // Go back to questionnaire or intermediate step
            const membership = state.onboardingForm.membership;
            if (membership === "Student") {
              setStep(0.1);
            } else if (membership === "Associate Member") {
              setStep(0.2);
            } else {
              setStep(0);
            }
          }}
          onStatusChange={handleUpdateStatusChange}
        />
      )}

      {step === 2 && (
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
