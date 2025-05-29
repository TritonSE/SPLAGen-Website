"use client";

import { useStateMachine } from "little-state-machine";
import Image from "next/image";
import { useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import styles from "./Category.module.css";

import { CreateUserRequestBody, signUpUser } from "@/api/users";
import { Button } from "@/components/Button";
import { onboardingState } from "@/state/stateTypes";

type CategoryProps = {
  onNext: (data: onboardingState["data"]) => void;
  onBack: () => void;
  onReset: () => void;
  onStatusChange: (status: "idle" | "submitting" | "success" | "error") => void;
};

export const Category: React.FC<CategoryProps> = ({ onNext, onBack, onReset, onStatusChange }) => {
  const { state } = useStateMachine();
  const { t } = useTranslation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const membershipType = state.onboardingForm.membership;

  const [article, membershipText] = useMemo(() => {
    switch (membershipType) {
      case "Student":
        return ["a", "Student"];
      case "Healthcare Professional":
        return ["a", "Healthcare Professional"];
      case "Genetic Counselor":
        return ["a", "Genetic Counselor"];
      default:
        return ["an", "Associate Member"];
    }
  }, [membershipType]);

  const registerUser = useCallback(async () => {
    try {
      setIsSubmitting(true);
      setError(null);
      onStatusChange("submitting");

      const membership = state.onboardingForm.membership.toLowerCase() as
        | "student"
        | "geneticCounselor"
        | "healthcareProvider"
        | "associate";

      const userData: CreateUserRequestBody = {
        password: state.onboardingForm.password,
        account: { membership },
        personal: {
          firstName: state.onboardingForm.firstName,
          lastName: state.onboardingForm.lastName,
          email: state.onboardingForm.email,
        },
      };

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

      if (membership === "student" && state.onboardingForm.schoolName) {
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

      if (membership === "associate" && state.onboardingForm.organizationName) {
        userData.associate = {
          title: state.onboardingForm.jobTitle,
          specialization: state.onboardingForm.specializations,
          organization: state.onboardingForm.organizationName,
        };
      }

      const result = await signUpUser(userData);

      if (result.success) {
        onStatusChange("success");
        onNext(state.onboardingForm); // Advance flow if needed
      } else {
        setError(result.error || t("registration-failed"));
        onStatusChange("error");
      }
    } catch (err) {
      console.error("Error registering user:", err);
      setError(t("registration-failed"));
      onStatusChange("error");
    } finally {
      setIsSubmitting(false);
    }
  }, [state.onboardingForm, onNext, onStatusChange, t]);

  return (
    <div className={styles.darkContainer}>
      <div className={styles.container}>
        <h2 className={styles.welcome}>Welcome to SPLAGen!</h2>

        <div className={styles.iconContainer}>
          <Image src="/icons/ic_success.svg" alt="Checkbox icon" width={81} height={81} />
        </div>

        <p className={styles.text}>
          You are being added to SPLAGen&apos;s full membership as {article}{" "}
          <span className={styles.membershipCategory}>{membershipText}</span>.
        </p>

        {error && (
          <>
            <p className="text-red-600 text-center my-2">{error}</p>
            <div className="flex justify-center mt-4">
              <button
                onClick={onReset}
                className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100"
              >
                {t("start-over")}
              </button>
            </div>
          </>
        )}

        <div className={styles.buttonContainer}>
          <button type="button" onClick={onBack} className={styles.backButton}>
            <Image src="/icons/ic_caretleft.svg" alt="Back Icon" width={24} height={24} />
            Back
          </button>

          <Button
            onClick={() => void registerUser()}
            label={isSubmitting ? t("loading") : t("confirm-and-register")}
            disabled={isSubmitting}
          />
        </div>
      </div>
    </div>
  );
};
