"use client";

import { useStateMachine } from "little-state-machine";
import Image from "next/image";
import { useCallback, useContext, useMemo, useState } from "react";

import styles from "./Category.module.css";

import {
  MembershipType,
  editMembership,
  updateAssociateInfo,
  updateStudentInfo,
} from "@/api/users";
import { Button } from "@/components/Button";
import { UserContext } from "@/contexts/userContext";

type EditMembershipCategoryProps = {
  onNext: () => void;
  onBack: () => void;
  onStatusChange: (status: "idle" | "submitting" | "success" | "error") => void;
};

export const EditMembershipCategory: React.FC<EditMembershipCategoryProps> = ({
  onNext,
  onBack,
  onStatusChange,
}) => {
  const { state } = useStateMachine();
  const { firebaseUser, reloadUser } = useContext(UserContext);
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

  const updateMembership = useCallback(async () => {
    if (!firebaseUser) return;

    try {
      setIsSubmitting(true);
      setError(null);
      onStatusChange("submitting");

      // Map display membership to API membership type
      const membershipMap: Record<string, MembershipType> = {
        Student: "student",
        "Healthcare Professional": "healthcareProvider",
        "Genetic Counselor": "geneticCounselor",
        "Associate Member": "associate",
      };

      const membership = membershipMap[state.onboardingForm.membership];
      const token = await firebaseUser.getIdToken();

      // Update membership first
      const response = await editMembership(membership, token);

      if (!response.success) {
        setError(response.error || "Failed to update membership");
        onStatusChange("error");
        return;
      }

      // If membership is student, also update student information
      if (membership === "student") {
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

        const studentInfoResponse = await updateStudentInfo(token, {
          schoolCountry: state.onboardingForm.schoolCountry?.value || "",
          schoolName: state.onboardingForm.schoolName,
          universityEmail: state.onboardingForm.universityEmail,
          degree: normalizedDegree,
          programName: state.onboardingForm.programName,
          gradDate: state.onboardingForm.graduationDate,
        });

        if (!studentInfoResponse.success) {
          setError(studentInfoResponse.error || "Failed to update student information");
          onStatusChange("error");
          return;
        }
      }

      // If membership is associate, also update associate information
      if (membership === "associate") {
        // Normalize specializations
        const specialization = (state.onboardingForm.specializations || []).map((s) =>
          s.toLowerCase(),
        );

        const associateInfoResponse = await updateAssociateInfo(token, {
          jobTitle: state.onboardingForm.jobTitle,
          specialization,
          isOrganizationRepresentative: state.onboardingForm.isOrganizationRepresentative,
          organizationName: state.onboardingForm.organizationName || "",
        });

        if (!associateInfoResponse.success) {
          setError(associateInfoResponse.error || "Failed to update associate information");
          onStatusChange("error");
          return;
        }
      }

      await reloadUser();
      onStatusChange("success");
      onNext();
    } catch (err) {
      console.error("Error updating membership:", err);
      setError("Failed to update membership");
      onStatusChange("error");
    } finally {
      setIsSubmitting(false);
    }
  }, [firebaseUser, state.onboardingForm, onNext, onStatusChange, reloadUser]);

  return (
    <div className={styles.darkContainer}>
      <div className={styles.container}>
        <h2 className={styles.welcome}>Update Membership Category</h2>

        <div className={styles.iconContainer}>
          <Image src="/icons/ic_success.svg" alt="Checkbox icon" width={81} height={81} />
        </div>

        <p className={styles.text}>
          Your membership category will be updated to {article}{" "}
          <span className={styles.membershipCategory}>{membershipText}</span>.
        </p>

        {error && (
          <>
            <p className="text-red-600 text-center my-2">{error}</p>
            <div className="flex justify-center mt-4">
              <button
                onClick={onBack}
                className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100"
              >
                Go Back
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
            onClick={() => void updateMembership()}
            label={isSubmitting ? "Updating..." : "Confirm and Update"}
            disabled={isSubmitting}
          />
        </div>
      </div>
    </div>
  );
};
