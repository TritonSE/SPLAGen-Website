"use client";

import { useStateMachine } from "little-state-machine";
import { useRouter } from "next/navigation";
import { useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

import {
  CreateUserRequestBody,
  DISPLAY_TO_DB_MEMBERSHIP,
  MembershipType,
  editMembership,
  loginUserWithEmailPassword,
  signUpUser,
  updateAssociateInfo,
  updateStudentInfo,
} from "@/api/users";
import { SuccessMessage } from "@/components/SuccessMessage";
import { LANGUAGES } from "@/components/languageSwitcher";
import {
  Associate,
  Basics,
  Category,
  ContinueToDirectory,
  Questionnaire,
  SignUp,
  Student,
} from "@/components/onboardingForm";
import { MembershipRules } from "@/components/onboardingForm/MembershipRules";
import { UserContext } from "@/contexts/userContext";
import { useUnsavedChangesWarning } from "@/hooks/useUnsavedChangesWarning";
import { onboardingState } from "@/state/stateTypes";
import updateOnboardingForm from "@/state/updateOnboardingForm";
import "@/app/globals.css";

export default function OnboardingForm() {
  const [step, setStep] = useState(0);
  const [registrationStatus, setRegistrationStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");
  const [finalizeError, setFinalizeError] = useState<string | null>(null);
  // Tracks whether signUpUser has already succeeded, so that retrying after a
  // later step fails (e.g. login or the student/associate info PATCH) doesn't
  // try to create a duplicate account with the same email. Also tracks which
  // membership the account was created with, in case the user goes back and
  // changes their answers after a partially-successful attempt.
  const accountCreatedRef = useRef(false);
  const createdMembershipRef = useRef<MembershipType | null>(null);
  const { state, actions } = useStateMachine({ actions: { updateOnboardingForm } });
  const { setOnboardingStep, user, loadingUser } = useContext(UserContext);
  const router = useRouter();
  const { t } = useTranslation();
  const [successMessage, setSuccessMessage] = useState("");

  // Accounts are only created once a membership category has been chosen (see
  // handleFinalizeSignup below), so a signed-in user with a "pending"
  // membership here must be a legacy account from before that change shipped.
  // Send them to the edit-membership flow to finish choosing a category.
  useEffect(() => {
    if (loadingUser) return;
    if (user?.account?.membership === "pending") {
      router.replace("/editMembership");
    }
  }, [loadingUser, user, router]);

  // Warn the user before they navigate away if they have entered any info but
  // haven't finished creating their account yet.
  const hasStartedOnboarding = Boolean(
    state.onboardingForm?.firstName || state.onboardingForm?.email || step > 0,
  );
  const hasUnsavedWork = hasStartedOnboarding && registrationStatus !== "success" && step < 5;
  useUnsavedChangesWarning(hasUnsavedWork, t("unsaved-changes-warning"));

  const handleNext = useCallback(
    (data: onboardingState["data"]) => {
      actions.updateOnboardingForm(data);

      setStep((prevStep) => prevStep + 1);
    },
    [actions, setStep],
  );

  const handleBack = useCallback(() => {
    setStep((prev) => Math.max(0, prev - 1));
  }, [setStep]);

  // Update the onboarding Progress stepper
  useEffect(() => {
    if (step === 0) {
      setOnboardingStep(0);
    } else if (step === 1) {
      setOnboardingStep(1);
    } else if (step === 2) {
      setOnboardingStep(2);
    } else if (step === 3) {
      setOnboardingStep(3);
    }
  }, [step, setOnboardingStep]);

  // Special flow handlers for Student and Associate Member paths
  const handleStudentFlow = useCallback(() => {
    setStep(3.1); // Use decimal to represent the student sub-step
  }, [setStep]);

  const handleAssociateFlow = useCallback(() => {
    setStep(3.2);
  }, [setStep]);

  const continueFromIntermediateStep = useCallback(() => {
    setStep(4); // Go to Step4A after either intermediate step
  }, [setStep]);

  // Going back from the questionnaire's Student/Associate sub-steps returns to
  // the questionnaire itself, so the user can re-answer and pick a different
  // category.
  const handleBackToQuestionnaire = useCallback(() => {
    setFinalizeError(null);
    setRegistrationStatus("idle");
    setStep(3);
  }, [setStep]);

  // Going back from the final confirmation screen returns to whichever step
  // is appropriate for the chosen membership category.
  const handleCategoryBack = useCallback(() => {
    setFinalizeError(null);
    setRegistrationStatus("idle");
    const membership = state.onboardingForm?.membership;
    if (membership === "Student") {
      setStep(3.1);
    } else if (membership === "Associate Member") {
      setStep(3.2);
    } else {
      setStep(3);
    }
  }, [state.onboardingForm?.membership]);

  // Handle registration status changes
  const handleRegistrationStatusChange = useCallback(
    (status: "idle" | "submitting" | "success" | "error") => {
      setRegistrationStatus(status);

      // If registration is successful, redirect to home page
      if (status === "success") {
        // Professional & healthcare members can be added to the directory
        if (
          state.onboardingForm?.membership === "Genetic Counselor" ||
          state.onboardingForm?.membership === "Other Genetics Professional" ||
          state.onboardingForm?.membership === "Healthcare Professional"
        ) {
          setStep(5);
        } else {
          setSuccessMessage(t("registration-submitted"));
          router.push("/");
        }
      }
    },
    [router, setRegistrationStatus, state.onboardingForm?.membership, t],
  );

  // Create the account now that the user has filled out all onboarding steps,
  // including choosing (and if applicable, filling out extra details for)
  // their membership category.
  const handleFinalizeSignup = useCallback(async () => {
    const data = state.onboardingForm;
    const dbMembership = DISPLAY_TO_DB_MEMBERSHIP[data.membership];

    if (!dbMembership) {
      setFinalizeError(t("registration-failed"));
      return;
    }

    setFinalizeError(null);
    setRegistrationStatus("submitting");

    const professionalTitleToUse =
      data.professionalTitle?.value === "other"
        ? data.professionalTitleOther
        : data.professionalTitle?.value;

    const normalizedLanguage = LANGUAGES.find(
      (lang) => lang.code === (data.language || "").toLowerCase(),
    )?.dbValue;

    const userData: CreateUserRequestBody = {
      password: data.password,
      account: { membership: dbMembership },
      personal: {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
      },
      professional: {
        title: professionalTitleToUse,
        country: data.country?.value,
        prefLanguage: normalizedLanguage,
      },
    };

    if (!accountCreatedRef.current) {
      const signUpResult = await signUpUser(userData);
      if (!signUpResult.success) {
        setFinalizeError(signUpResult.error || t("registration-failed"));
        setRegistrationStatus("error");
        return;
      }
      accountCreatedRef.current = true;
      createdMembershipRef.current = dbMembership;
    }

    const loginResult = await loginUserWithEmailPassword(data.email, data.password);
    if (!loginResult.success) {
      setFinalizeError(loginResult.error || t("registration-failed"));
      setRegistrationStatus("error");
      return;
    }

    const { token } = loginResult.data;

    // If the account was already created by an earlier, partially-failed
    // attempt, but the user has since gone back and chosen a different
    // category, make sure the account reflects the latest choice.
    if (createdMembershipRef.current && createdMembershipRef.current !== dbMembership) {
      const editResult = await editMembership(dbMembership, token);
      if (!editResult.success) {
        setFinalizeError(editResult.error || t("registration-failed"));
        setRegistrationStatus("error");
        return;
      }
      createdMembershipRef.current = dbMembership;
    }

    // Now that the account exists, attach any category-specific info that was
    // collected earlier in the flow.
    if (dbMembership === "student") {
      const studentResult = await updateStudentInfo(token, {
        schoolCountry: data.schoolCountry?.value ?? "",
        schoolName: data.schoolName,
        universityEmail: data.universityEmail,
        degree: data.degree,
        programName: data.programName,
        gradDate: data.graduationDate,
      });
      if (!studentResult.success) {
        setFinalizeError(studentResult.error || t("registration-failed"));
        setRegistrationStatus("error");
        return;
      }
    } else if (dbMembership === "associate") {
      const associateResult = await updateAssociateInfo(token, {
        jobTitle: data.jobTitle || "",
        specialization: data.specializations || [],
        isOrganizationRepresentative: data.isOrganizationRepresentative || "",
        organizationName: data.organizationName ?? "",
      });
      if (!associateResult.success) {
        setFinalizeError(associateResult.error || t("registration-failed"));
        setRegistrationStatus("error");
        return;
      }
    }

    handleRegistrationStatusChange("success");
  }, [state.onboardingForm, t, handleRegistrationStatusChange]);

  const isFinalizing = useMemo(() => registrationStatus === "submitting", [registrationStatus]);

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
      {step === 1 && <MembershipRules onBack={handleBack} onNext={handleNext} />}
      {step === 2 && <Basics onBack={handleBack} onNext={handleNext} />}

      {step === 3 && (
        <Questionnaire
          onNext={handleNext}
          onBack={handleBack}
          onStudentFlow={handleStudentFlow}
          onAssociateFlow={handleAssociateFlow}
          mode="create"
        />
      )}

      {step === 3.1 && (
        <Student
          onNext={continueFromIntermediateStep}
          onBack={handleBackToQuestionnaire}
          mode="create"
        />
      )}

      {step === 3.2 && (
        <Associate
          onNext={continueFromIntermediateStep}
          onBack={handleBackToQuestionnaire}
          mode="create"
        />
      )}

      {step === 4 && (
        <Category
          onContinue={handleFinalizeSignup}
          onBack={handleCategoryBack}
          isSubmitting={isFinalizing}
          error={finalizeError}
        />
      )}

      {step === 5 && (
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
