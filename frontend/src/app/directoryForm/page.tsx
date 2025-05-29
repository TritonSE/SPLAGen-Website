"use client";

import { useStateMachine } from "little-state-machine";
import { useCallback, useState } from "react";

import { DirectoryBasics, Result } from "@/components/directoryForm";
import { directoryState } from "@/state/stateTypes";
import updateDirectoryForm from "@/state/updateDirectoryForm";

export default function DirectoryForm() {
  const { actions } = useStateMachine({ actions: { updateDirectoryForm } });
  const [currentStep, setCurrentStep] = useState(1);

  const handleNext = useCallback(
    (data: directoryState["data"]) => {
      actions.updateDirectoryForm(data);
      // Move to the next step (Result page)
      setCurrentStep(2);
    },
    [actions, setCurrentStep],
  );

  const handleReset = useCallback(() => {
    actions.updateDirectoryForm({
      educationType: "",
      educationInstitution: "",
      workClinic: "",
      clinicWebsite: "",
      clinicCountry: { value: "", label: "" },
      addressLine1: "",
      addressLine2: "",
      city: "",
      state: "",
      postcode: "",
    });
    setCurrentStep(1);
  }, [actions, setCurrentStep]);

  return (
    <div className="w-full h-full">
      {currentStep === 1 ? (
        <DirectoryBasics onNext={handleNext} />
      ) : (
        <Result onReset={handleReset} />
      )}
    </div>
  );
}
