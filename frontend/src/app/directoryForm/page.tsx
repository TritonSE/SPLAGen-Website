"use client";

import { useStateMachine } from "little-state-machine";
import Link from "next/link";
import { useCallback, useContext, useState } from "react";
import { useTranslation } from "react-i18next";

import { Button } from "@/components";
import { DirectoryBasics, DirectoryContact, DirectoryServices } from "@/components/directoryForm";
import { UserContext } from "@/contexts/userContext";
import { useRedirectToLoginIfNotSignedIn } from "@/hooks/useRedirection";
import { directoryState } from "@/state/stateTypes";
import updateDirectoryForm from "@/state/updateDirectoryForm";
import "@/app/globals.css";

export default function DirectoryForm() {
  useRedirectToLoginIfNotSignedIn();

  const { t } = useTranslation();
  const { user } = useContext(UserContext);

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
      // Contact page fields
      workEmail: "",
      workPhone: "",
      licenseType: "no_license",
      licenseNumber: "",
      noLicenseReason: "",
      additionalComments: "",
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
        return <DirectoryContact onReset={handleReset} onBack={handleBack} />;
      default:
        setCurrentStep(1);
        return <DirectoryBasics onNext={handleNext} />;
    }
  };

  if (user && [true, "pending"].includes(user.account.inDirectory)) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-3">
        <p className="text-black font-[20px] font-bold">
          {user.account.inDirectory === "pending"
            ? t("already-applied-to-directory")
            : t("already-in-directory")}
        </p>
        <Link href="/profile?tab=Directory">
          <Button label={t("edit-directory-information")} />
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col gap-2 items-center pt-10">
      <div className="flex flex-row items-center gap-8 whitespace-nowrap">
        <Link href="/">
          <Button variant="secondary" label={t("skip-for-now")} />
        </Link>
        <p>{t("join-directory-later")}</p>
      </div>
      {renderStep()}
    </div>
  );
}
