"use client";

import { useStateMachine } from "little-state-machine";
import Image from "next/image";
import { useContext, useMemo } from "react";
import { useTranslation } from "react-i18next";

import styles from "./Category.module.css";

import { MembershipType, membershipDisplayMap } from "@/api/users";
import { Button } from "@/components/Button";
import { UserContext } from "@/contexts/userContext";

// Map display membership to API membership type
const membershipMap: Record<string, MembershipType> = {
  Student: "student",
  "Healthcare Professional": "healthcareProfessional",
  "Other Genetics Professional": "otherGeneticsProfessional",
  "Genetic Counselor": "geneticCounselor",
  "Associate Member": "associate",
};

type EditMembershipCategoryProps = {
  onStatusChange: (status: "idle" | "submitting" | "success" | "error") => void;
};

export const EditMembershipCategory: React.FC<EditMembershipCategoryProps> = ({
  onStatusChange,
}) => {
  const { t } = useTranslation();
  const { state } = useStateMachine();
  const { reloadUser } = useContext(UserContext);

  const membershipType = state.onboardingForm.membership;
  const membershipKey = useMemo(() => membershipMap[membershipType], [membershipType]);

  return (
    <div className={styles.darkContainer}>
      <div className={styles.container}>
        <h2 className={styles.welcome}>{t("update-membership-category")}</h2>

        <div className={styles.iconContainer}>
          <Image src="/icons/ic_success.svg" alt="Checkbox icon" width={81} height={81} />
        </div>

        <p className={styles.text}>
          {t("membership-update-message", {
            membership: t(membershipDisplayMap[membershipKey]),
          })}
        </p>

        <div className={styles.buttonContainer}>
          <Button
            onClick={() => {
              // The membership + sub-flow data was already PATCHed in earlier steps;
              // reload the user so downstream pages see the fresh data.
              reloadUser();
              onStatusChange("success");
            }}
            label={t("continue")}
          />
        </div>
      </div>
    </div>
  );
};
