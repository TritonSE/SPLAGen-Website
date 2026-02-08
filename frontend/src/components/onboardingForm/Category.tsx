"use client";

import { useStateMachine } from "little-state-machine";
import Image from "next/image";
import { useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import styles from "./Category.module.css";

import {
  CreateUserRequestBody,
  MembershipType,
  getWhoAmI,
  loginUserWithEmailPassword,
  signUpUser,
} from "@/api/users";
import { Button } from "@/components/Button";
import { LANGUAGES } from "@/components/languageSwitcher";

type CategoryProps = {
  onBack: () => void;
  onReset: () => void;
  onStatusChange: (status: "idle" | "submitting" | "success" | "error") => void;
};

export const Category: React.FC<CategoryProps> = ({ onBack, onReset, onStatusChange }) => {
  const { state } = useStateMachine();
  const { t } = useTranslation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const membershipType = state.onboardingForm.membership;

  const membershipText = useMemo(() => {
    switch (membershipType) {
      case "Student":
        return t("category-membership-student");
      case "Healthcare Professional":
        return t("category-membership-healthcare");
      case "Genetic Counselor":
        return t("category-membership-genetic-counselor");
      default:
        return t("category-membership-associate");
    }
  }, [membershipType, t]);

  const registerUser = useCallback(async () => {
    try {
      setIsSubmitting(true);
      setError(null);
      onStatusChange("submitting");

      // Normalize membership to expected type
      const membership = {
        Student: "student",
        "Healthcare Professional": "healthcareProvider",
        "Genetic Counselor": "geneticCounselor",
        "Associate Member": "associate",
      }[state.onboardingForm.membership] as MembershipType;

      // Normalize language
      const languageCode = state.onboardingForm.language;
      const normalizedLanguage = LANGUAGES.find(
        (lang) => lang.code === languageCode.toLowerCase(),
      )?.dbValue;

      const userData: CreateUserRequestBody = {
        password: state.onboardingForm.password,
        account: { membership },
        personal: {
          firstName: state.onboardingForm.firstName,
          lastName: state.onboardingForm.lastName,
          email: state.onboardingForm.email,
          phone: state.onboardingForm.phone,
        },
      };

      const professionalTitleToUse =
        state.onboardingForm.professionalTitle?.value === "other"
          ? state.onboardingForm.professionalTitleOther
          : state.onboardingForm.professionalTitle?.value;
      userData.professional = {
        title: professionalTitleToUse,
        country: state.onboardingForm.country?.value,
        prefLanguage: normalizedLanguage,
      };

      if (membership === "student" && state.onboardingForm.schoolName) {
        // Normalize degree
        const degreeMap: Record<
          string,
          "other" | "masters" | "diploma" | "fellowship" | "md" | "phd"
        > = {
          ms: "masters",
          phd: "phd",
          md: "md",
        };

        const normalizedDegree =
          degreeMap[state.onboardingForm.degree?.toLowerCase() || ""] || "other";

        userData.education = {
          degree: normalizedDegree,
          institution: state.onboardingForm.schoolName,
          email: state.onboardingForm.universityEmail,
          program: state.onboardingForm.programName,
          gradDate: state.onboardingForm.graduationDate,
          schoolCountry: state.onboardingForm.schoolCountry?.value,
        };
      }

      if (membership === "associate" && state.onboardingForm.organizationName) {
        // Normalize specializations
        const specialization = (state.onboardingForm.specializations || []).map((s) =>
          s.toLowerCase(),
        );

        userData.associate = {
          title: state.onboardingForm.jobTitle,
          specialization: specialization.length > 0 ? specialization : undefined,
          organization: state.onboardingForm.organizationName,
        };
      }

      const result = await signUpUser(userData);

      if (result.success) {
        // Log in with Firebase
        const loginResult = await loginUserWithEmailPassword(
          userData.personal.email,
          userData.password,
        );
        if (!loginResult.success) {
          setError(loginResult.error || t("registration-failed"));
          onStatusChange("error");
          return;
        }

        const authResult = await getWhoAmI(loginResult.data.token);
        if (!authResult.success) {
          setError(authResult.error || t("registration-failed"));
          onStatusChange("error");
          return;
        }

        onStatusChange("success");
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
  }, [state.onboardingForm, onStatusChange, t]);

  return (
    <div className={styles.darkContainer}>
      <div className={styles.container}>
        <h2 className={styles.welcome}>{t("category-welcome")}</h2>

        <div className={styles.iconContainer}>
          <Image src="/icons/ic_success.svg" alt="Checkbox icon" width={81} height={81} />
        </div>

        <p className={styles.text}>
          {t("category-membership-text")}{" "}
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
            {t("back")}
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
