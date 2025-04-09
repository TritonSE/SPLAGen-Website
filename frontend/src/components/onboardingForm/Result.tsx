"use client";

import { useStateMachine } from "little-state-machine";

import updateOnboardingForm from "@/state/updateOnboardingForm";

type ResultProps = {
  onReset: () => void;
};

export const Result = ({ onReset }: ResultProps) => {
  const { state } = useStateMachine({ actions: { updateOnboardingForm } });

  return (
    <div>
      <h2 className="text-xl font-bold">Form Submission Result</h2>
      <p>
        <strong>Professional Title:</strong> {state.onboardingForm.professionalTitle.value}
      </p>
      <p>
        <strong>Country:</strong> {state.onboardingForm.country.value}
      </p>
      <p>
        <strong>Languages:</strong> {JSON.stringify(state.onboardingForm.languages)}
      </p>
      <p>
        <strong>Membership Category:</strong> {state.onboardingForm.membership}
      </p>
      <p>
        <strong>Associate Data</strong>
      </p>
      <p>
        <strong>Specializations:</strong> {state.onboardingForm.specializations}
      </p>
      <p>
        <strong>OrgRepresentative:</strong> {state.onboardingForm.isOrganizationRepresentative}
      </p>
      <p>
        <strong>Title:</strong> {state.onboardingForm.jobTitle}
      </p>
      <p>
        <strong>Org Name:</strong> {state.onboardingForm.organizationName}
      </p>
      <p>
        <strong>Student Data</strong>
      </p>
      <p>
        <strong>Degree:</strong> {state.onboardingForm.degree}
      </p>
      <p>
        <strong>Country:</strong> {state.onboardingForm.schoolCountry?.value}
      </p>
      <p>
        <strong>School Name:</strong> {state.onboardingForm.schoolName}
      </p>
      <p>
        <strong>Email:</strong> {state.onboardingForm.universityEmail}
      </p>
      <p>
        <strong>Program:</strong> {state.onboardingForm.programName}
      </p>
      <p>
        <strong>Grad Date:</strong> {state.onboardingForm.graduationDate}
      </p>
      <button onClick={onReset}>Back</button>
    </div>
  );
};
