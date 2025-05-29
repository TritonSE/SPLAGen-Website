"use client";

import { useStateMachine } from "little-state-machine";
import { useCallback, useState } from "react";

import { DirectoryBasics, DirectoryServices, Result } from "@/components/directoryForm";
import { directoryState } from "@/state/stateTypes";
import updateDirectoryForm from "@/state/updateDirectoryForm";

export default function DirectoryForm() {
  const { actions } = useStateMachine({ actions: { updateDirectoryForm } });
  const [currentStep, setCurrentStep] = useState(1);

  const handleNext = useCallback(
    (data: directoryState["data"]) => {
      actions.updateDirectoryForm(data);
      // Move to the next step
      setCurrentStep((prev) => prev + 1);
    },
    [actions, setCurrentStep],
  );

  const handleBack = useCallback(() => {
    setCurrentStep((prev) => prev - 1);
  }, [setCurrentStep]);

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
      // Services page fields
      canMakeAppointments: undefined,
      canRequestTests: undefined,
      offersTelehealth: undefined,
      specialtyServices: [],
      careLanguages: [],
      authorizedForLanguages: undefined,
    });
    setCurrentStep(1);
  }, [actions, setCurrentStep]);

  // Render the current step
  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <DirectoryBasics onNext={handleNext} />;
      case 2:
        return <DirectoryServices onNext={handleNext} onBack={handleBack} />;
      case 3:
        return <Result onReset={handleReset} />;
      default:
        setCurrentStep(1);
        return <DirectoryBasics onNext={handleNext} />;
    }
  };

  return <div className="w-full h-full">{renderStep()}</div>;
}
