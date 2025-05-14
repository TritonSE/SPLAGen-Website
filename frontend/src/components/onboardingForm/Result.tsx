"use client";

import { useStateMachine } from "little-state-machine";
import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";

import { CreateUserRequestBody, signUpUser } from "@/api/users";
import updateOnboardingForm from "@/state/updateOnboardingForm";

type ResultProps = {
  onReset: () => void;
  onStatusChange?: (status: "idle" | "submitting" | "success" | "error") => void;
};

export const Result = ({ onReset, onStatusChange }: ResultProps) => {
  const { state } = useStateMachine({ actions: { updateOnboardingForm } });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const { t } = useTranslation();

  // Function to register the user with our backend
  const registerUser = useCallback(async () => {
    try {
      setIsSubmitting(true);
      setError(null);
      onStatusChange?.("submitting");

      // Determine membership type from the state
      const membershipType = state.onboardingForm.membership.toLowerCase() as
        | "student"
        | "geneticCounselor"
        | "healthcareProvider"
        | "associate";

      // Prepare user data for registration
      const userData: CreateUserRequestBody = {
        password: state.onboardingForm.password,
        account: {
          membership: membershipType,
        },
        personal: {
          firstName: state.onboardingForm.firstName,
          lastName: state.onboardingForm.lastName,
          email: state.onboardingForm.email,
        },
      }; // Add professional data if available
      if (state.onboardingForm.professionalTitle?.value) {
        userData.professional = {
          title: state.onboardingForm.professionalTitle.value,
          country: state.onboardingForm.country?.value,
          prefLanguages: state.onboardingForm.languages as (
            | "english"
            | "spanish"
            | "portuguese"
            | "other"
          )[],
        };
      }

      // Add student-specific data
      if (membershipType === "student" && state.onboardingForm.schoolName) {
        userData.education = {
          degree: state.onboardingForm.degree as
            | "masters"
            | "diploma"
            | "fellowship"
            | "md"
            | "phd"
            | "other",
          institution: state.onboardingForm.schoolName,
          email: state.onboardingForm.universityEmail,
          program: state.onboardingForm.programName,
          gradDate: state.onboardingForm.graduationDate,
        };
      }

      // Add associate-specific data
      if (membershipType === "associate" && state.onboardingForm.organizationName) {
        userData.associate = {
          title: state.onboardingForm.jobTitle,
          specialization: state.onboardingForm.specializations as (
            | "rare disease advocacy"
            | "research"
            | "public health"
            | "bioethics"
            | "law"
            | "biology"
            | "medical writer"
            | "medical science liason"
            | "laboratory scientist"
            | "professor"
            | "bioinformatics"
            | "biotech sales and marketing"
          )[],
          organization: state.onboardingForm.organizationName,
        };
      }

      // Register the user
      const result = await signUpUser(userData);

      if (result.success) {
        setSuccess(true);
        onStatusChange?.("success");
        // Let the parent page handle redirect
      } else {
        setError(result.error || t("registration-failed"));
        onStatusChange?.("error");
      }
    } catch (err) {
      console.error("Error registering user:", err);
      setError(t("registration-failed"));
      onStatusChange?.("error");
    } finally {
      setIsSubmitting(false);
    }
  }, [state.onboardingForm, t, onStatusChange]);
  // Registration is now triggered by the user clicking the "Confirm and Register" button
  // Helper function to render summary item
  const renderSummaryItem = (label: string, value: string | string[] | undefined | null) => {
    if (!value || (Array.isArray(value) && value.length === 0)) return null;

    return (
      <div className="mb-2">
        <span className="font-semibold">{label}: </span>
        <span className="text-gray-700">{Array.isArray(value) ? value.join(", ") : value}</span>
      </div>
    );
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 max-w-3xl mx-auto">
      {!isSubmitting && !error && !success && (
        <div className="w-full">
          <h2 className="text-2xl font-bold mb-4 text-center">{t("registration-summary")}</h2>
          <p className="mb-6 text-center">{t("confirm-details")}</p>

          <div className="border rounded-lg p-6 mb-6 bg-white shadow-sm">
            <h3 className="text-lg font-semibold mb-3 border-b pb-2">
              {t("personal-information")}
            </h3>
            {renderSummaryItem(t("first-name"), state.onboardingForm.firstName)}
            {renderSummaryItem(t("last-name"), state.onboardingForm.lastName)}
            {renderSummaryItem(t("email"), state.onboardingForm.email)}

            <h3 className="text-lg font-semibold mt-4 mb-3 border-b pb-2">
              {t("professional-information")}
            </h3>
            {renderSummaryItem(
              t("professional-title"),
              state.onboardingForm.professionalTitle?.value,
            )}
            {renderSummaryItem(t("country"), state.onboardingForm.country?.value)}
            {renderSummaryItem(t("languages"), state.onboardingForm.languages)}
            {renderSummaryItem(t("membership-category"), state.onboardingForm.membership)}

            {state.onboardingForm.membership === "Student" && (
              <div className="mt-4">
                <h3 className="text-lg font-semibold mb-3 border-b pb-2">
                  {t("student-information")}
                </h3>
                {renderSummaryItem(t("degree"), state.onboardingForm.degree)}
                {renderSummaryItem(t("school-country"), state.onboardingForm.schoolCountry?.value)}
                {renderSummaryItem(t("school-name"), state.onboardingForm.schoolName)}
                {renderSummaryItem(t("university-email"), state.onboardingForm.universityEmail)}
                {renderSummaryItem(t("program-name"), state.onboardingForm.programName)}
                {renderSummaryItem(t("graduation-date"), state.onboardingForm.graduationDate)}
              </div>
            )}

            {state.onboardingForm.membership === "Associate Member" && (
              <div className="mt-4">
                <h3 className="text-lg font-semibold mb-3 border-b pb-2">
                  {t("associate-information")}
                </h3>
                {renderSummaryItem(t("specializations"), state.onboardingForm.specializations)}
                {renderSummaryItem(
                  t("organization-representative"),
                  state.onboardingForm.isOrganizationRepresentative,
                )}
                {renderSummaryItem(t("job-title"), state.onboardingForm.jobTitle)}
                {renderSummaryItem(t("organization-name"), state.onboardingForm.organizationName)}
              </div>
            )}
          </div>

          <div className="flex justify-center space-x-4">
            <button
              onClick={() => {
                onReset();
              }}
              className="px-6 py-2 border border-gray-300 rounded hover:bg-gray-100"
            >
              {t("edit-information")}
            </button>
            <button
              onClick={() => {
                void registerUser();
              }}
              className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              {t("confirm-and-register")}
            </button>
          </div>
        </div>
      )}

      {isSubmitting && (
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">{t("registration-processing")}</h2>
          <p className="mb-4">{t("creating-your-account")}</p>
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-100 text-red-700 rounded-md w-full max-w-md">
          <p className="font-bold text-center">{t("registration-error")}</p>
          <p className="mb-4 text-center">{error}</p>
          <div className="flex justify-center space-x-4">
            <button
              onClick={() => {
                void registerUser();
              }}
              className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              {t("try-again")}
            </button>
            <button
              onClick={() => {
                onReset();
              }}
              className="px-6 py-2 border border-gray-300 rounded hover:bg-gray-100"
            >
              {t("start-over")}
            </button>
          </div>
        </div>
      )}

      {success && (
        <div className="p-4 bg-green-100 text-green-700 rounded-md w-full max-w-md text-center">
          <p className="font-bold">{t("registration-success")}</p>
          <p>{t("redirecting-to-login")}</p>
        </div>
      )}
    </div>
  );
};
