"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Radio } from "@tritonse/tse-constellation";
import { useStateMachine } from "little-state-machine";
import Image from "next/image";
import { useCallback, useContext, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";

import styles from "./Associate.module.css";

import { updateAssociateInfo } from "@/api/users";
import { Button } from "@/components";
import { SPECIALIZATIONS } from "@/constants/specializations";
import { UserContext } from "@/contexts/userContext";
import updateOnboardingForm from "@/state/updateOnboardingForm";

const formSchema = (t: (key: string) => string) =>
  z.object({
    jobTitle: z.string().min(1, t("job-title-required")),
    specializations: z.array(z.string()).min(1, t("select-at-least-one-specialization-required")),
    isOrganizationRepresentative: z.string().min(1, t("please-select-option")),
    organizationName: z.string().optional(),
  });

type FormData = z.infer<ReturnType<typeof formSchema>>;

type AssociateProps = {
  onNext: (data: FormData) => void;
  // "edit" (default) PATCHes associate info onto the current, already-existing
  // account right away. "create" just stores it locally, since the account
  // doesn't exist yet (used by the signup flow).
  mode?: "edit" | "create";
  // If provided, shows a back button that calls this instead of submitting.
  onBack?: () => void;
};

export const Associate = ({ onNext, mode = "edit", onBack }: AssociateProps) => {
  const { t } = useTranslation();
  const { state, actions } = useStateMachine({ actions: { updateOnboardingForm } });
  const { firebaseUser } = useContext(UserContext);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmittingApi, setIsSubmittingApi] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { isValid, errors },
  } = useForm({
    resolver: zodResolver(formSchema(t)),
    defaultValues: state.onboardingForm,
    mode: "onChange",
  });

  const onSubmit = useCallback(
    async (data: FormData) => {
      actions.updateOnboardingForm(data);

      if (mode === "edit") {
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
            organizationName: data.organizationName ?? "",
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
      }

      onNext(data);
    },
    [actions, onNext, firebaseUser, mode, t],
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

      setValue("specializations", currentSpecializations, { shouldValidate: true });
    },
    [setValue, watchSpecializations],
  );

  const handleRepresentativeSelection = useCallback(
    (value: string) => {
      setValue("isOrganizationRepresentative", value, { shouldValidate: true });
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
          <p className={styles.errorText}>{errors.jobTitle ? errors.jobTitle.message : "\u00A0"}</p>
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
          <p className={styles.errorText}>
            {errors.specializations ? errors.specializations.message : "\u00A0"}
          </p>
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
          <p className={styles.errorText}>
            {errors.isOrganizationRepresentative
              ? errors.isOrganizationRepresentative.message
              : "\u00A0"}
          </p>
        </div>

        <div>
          <label className={styles.label}>{t("organization-name-label")}</label>
          <input
            {...register("organizationName")}
            className={styles.input}
            placeholder={t("organization-name-placeholder")}
          />
          <p className={styles.errorText}>
            {errors.organizationName ? errors.organizationName.message : "\u00A0"}
          </p>
        </div>

        {submitError && <p style={{ color: "red" }}>{submitError}</p>}

        <div className={styles.buttonContainer}>
          {onBack && (
            <button type="button" onClick={onBack} className={styles.backButton}>
              <Image src="/icons/ic_caretleft.svg" alt="Back Icon" width={24} height={24} />
              {t("back")}
            </button>
          )}

          <Button
            type="submit"
            disabled={!isValid || isSubmittingApi}
            label={isSubmittingApi ? t("loading") : t("continue")}
          />
        </div>
      </form>
    </div>
  );
};
