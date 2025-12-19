"use client";

import { useStateMachine } from "little-state-machine";

import updateDirectoryForm from "@/state/updateDirectoryForm";

type ResultProps = {
  onReset: () => void;
};

export const Result = ({ onReset }: ResultProps) => {
  const { state } = useStateMachine({ actions: { updateDirectoryForm } });

  return (
    <div>
      <h2 className="text-xl font-bold">Form Submission Result</h2>

      {/* Basic Information */}
      <p>
        <strong>educationType:</strong> {state.directoryForm.educationType}
      </p>
      <p>
        <strong>educationInstitution:</strong> {state.directoryForm.educationInstitution}
      </p>
      <p>
        <strong>workClinic:</strong> {state.directoryForm.workClinic}
      </p>
      <p>
        <strong>clinicWebsite:</strong> {state.directoryForm.clinicWebsite}
      </p>
      <p>
        <strong>clinicCountry:</strong> {state.directoryForm.clinicCountry?.value}
      </p>
      <p>
        <strong>addressLine1:</strong> {state.directoryForm.addressLine1}
      </p>
      <p>
        <strong>addressLine2:</strong> {state.directoryForm.addressLine2}
      </p>
      <p>
        <strong>city:</strong> {state.directoryForm.city}
      </p>
      <p>
        <strong>state:</strong> {state.directoryForm.state}
      </p>
      <p>
        <strong>postcode:</strong> {state.directoryForm.postcode}
      </p>

      {/* Services Information */}
      <p>
        <strong>appointments:</strong> {String(state.directoryForm.canMakeAppointments)}
      </p>
      <p>
        <strong>tests:</strong> {String(state.directoryForm.canRequestTests)}
      </p>
      <p>
        <strong>telehealth:</strong> {String(state.directoryForm.offersTelehealth)}
      </p>
      <p>
        <strong>services:</strong> {state.directoryForm.specialtyServices.join(", ")}
      </p>
      <p>
        <strong>languages:</strong> {state.directoryForm.careLanguages.join(", ")}
      </p>
      <p>
        <strong>authorizedLanguages:</strong> {String(state.directoryForm.authorizedForLanguages)}
      </p>

      {/* Contact Information */}
      <p>
        <strong>email:</strong> {state.directoryForm.email}
      </p>
      <p>
        <strong>phone:</strong> {state.directoryForm.phone}
      </p>
      <p>
        <strong>licenseType:</strong> {state.directoryForm.licenseType}
      </p>
      <p>
        <strong>licenseNumber:</strong> {state.directoryForm.licenseNumber}
      </p>
      <p>
        <strong>noLicenseReason:</strong> {state.directoryForm.noLicenseReason}
      </p>
      <p>
        <strong>additionalComments:</strong> {state.directoryForm.additionalComments}
      </p>

      <button onClick={onReset}>Back</button>
    </div>
  );
};
