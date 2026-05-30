"use client";

import { Radio } from "@tritonse/tse-constellation";
import { useStateMachine } from "little-state-machine";
import { useCallback, useContext, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

import styles from "./Associate.module.css";

import { updateAssociateInfo } from "@/api/users";
import { Button } from "@/components";
import { SPECIALIZATIONS } from "@/constants/specializations";
import { UserContext } from "@/contexts/userContext";
import { onboardingState } from "@/state/stateTypes";
import updateOnboardingForm from "@/state/updateOnboardingForm";

type AssociateProps = {
  onNext: (data: onboardingState["data"]) => void;
};

export const Associate = ({ onNext }: AssociateProps) => {
  const { t } = useTranslation();
  const { state, actions } = useStateMachine({ actions: { updateOnboardingForm } });
  const { firebaseUser } = useContext(UserContext);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmittingApi, setIsSubmittingApi] = useState(false);

  const { register, handleSubmit, control, watch, setValue } = useForm({
    defaultValues: state.onboardingForm,
  });

  const onSubmit = useCallback(
    async (data: onboardingState["data"]) => {
      actions.updateOnboardingForm(data);

      if (!firebaseUser) {
        setSubmitError(t("registration-failed"));
        return;
      }
      setSubmitError(null);
      setIsSubmittingApi(true);

      try {
        const token = await firebaseUser.getIdToken();
        const result = await updateAssociateInfo(token, {
          jobTitle: data.jobTitle || "",
          specialization: data.specializations || [],
          isOrganizationRepresentative: data.isOrganizationRepresentative || "",
          organizationName: data.organizationName || "",
        });
        if (!result.success) {
          setSubmitError(result.error || t("registration-failed"));
          return;
        }
      } catch {
        setSubmitError(t("registration-failed"));
        return;
      } finally {
        setIsSubmittingApi(false);
      }

      onNext(data);
    },
    [actions, onNext, firebaseUser, t],
  );

  const handleFormSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      void handleSubmit(onSubmit)();
    },
    [handleSubmit, onSubmit],
  );

  const rawSpecializations = watch("specializations");
  const watchSpecializations = useMemo(() => rawSpecializations || [], [rawSpecializations]);
  const isRepresentative = watch("isOrganizationRepresentative");

  const toggleSpecialization = useCallback(
    (specialization: string) => {
      const currentSpecializations = [...watchSpecializations];
      const index = currentSpecializations.indexOf(specialization);

      if (index === -1) {
        currentSpecializations.push(specialization);
      } else {
        currentSpecializations.splice(index, 1);
      }

      setValue("specializations", currentSpecializations);
    },
    [setValue, watchSpecializations],
  );

  const handleRepresentativeSelection = useCallback(
    (value: string) => {
      setValue("isOrganizationRepresentative", value);
    },
    [setValue],
  );

  return (
    <div className={styles.container}>
      <form onSubmit={handleFormSubmit} className={styles.form}>
        <div>
          <h2 className={styles.title}>{t("associate-title")}</h2>
        </div>

        <div>
          <label className={styles.label}>{t("associate-job-title-label")}</label>
          <input
            {...register("jobTitle")}
            className={styles.input}
            placeholder={t("associate-job-title-placeholder")}
          />
        </div>

        <div>
          <label className={styles.label}>{t("area-of-specialization")}</label>
          <Controller
            name="specializations"
            control={control}
            defaultValue={[]}
            render={() => (
              <div className={styles.specializationContainer}>
                {SPECIALIZATIONS.map((specialization) => {
                  const isSelected = watchSpecializations.includes(specialization);
                  return (
                    <button
                      key={specialization}
                      type="button"
                      className={`${styles.specializationButton} ${isSelected ? styles.specializationButtonSelected : ""}`}
                      onClick={() => {
                        toggleSpecialization(specialization);
                      }}
                    >
                      {t(specialization)}
                    </button>
                  );
                })}
              </div>
            )}
          />
        </div>

        <div>
          <label className={styles.label}>{t("representative-question")}</label>
          <div className={styles.radioGroup}>
            <Radio
              id="representative-yes"
              label={t("yes")}
              checked={isRepresentative === "yes"}
              onChange={() => {
                handleRepresentativeSelection("yes");
              }}
            />
            <Radio
              id="representative-no"
              label={t("no")}
              checked={isRepresentative === "no"}
              onChange={() => {
                handleRepresentativeSelection("no");
              }}
            />
          </div>
        </div>

        <div>
          <label className={styles.label}>{t("organization-name-label")}</label>
          <input
            {...register("organizationName")}
            className={styles.input}
            placeholder={t("organization-name-placeholder")}
          />
        </div>

        {submitError && <p style={{ color: "red" }}>{submitError}</p>}

        <div className={styles.buttonContainer}>
          <Button
            type="submit"
            disabled={isSubmittingApi}
            label={isSubmittingApi ? t("loading") : t("continue")}
          />
        </div>
      </form>
    </div>
  );
};
