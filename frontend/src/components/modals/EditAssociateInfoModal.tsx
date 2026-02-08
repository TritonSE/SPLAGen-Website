"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Radio } from "@tritonse/tse-constellation";
import React, { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";

import styles from "./EditAssociateInfoModal.module.css";
import { Modal } from "./Modal";

import { User, updateAssociateInfo } from "@/api/users";
import { SuccessMessage } from "@/components/SuccessMessage";
import { SPECIALIZATIONS } from "@/constants/specializations";
import { UserContext } from "@/contexts/userContext";

const schema = (t: (key: string) => string) =>
  z.object({
    jobTitle: z.string().min(1, t("job-title-required")),
    specialization: z.array(z.string()).min(1, t("select-at-least-one-specialization-required")),
    isOrganizationRepresentative: z.enum(["yes", "no"], {
      errorMap: () => ({ message: t("please-select-option") }),
    }),
    organizationName: z.string().optional(),
  });

type FormData = z.infer<ReturnType<typeof schema>>;

export const EditAssociateInfoModal = ({
  isOpen,
  onClose,
  populationInfo,
}: {
  isOpen: boolean;
  onClose: () => void;
  populationInfo: User | null;
}) => {
  const { t } = useTranslation();
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm<FormData>({
    resolver: zodResolver(schema(t)),
  });

  const { firebaseUser, reloadUser } = useContext(UserContext);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const rawSpecializations = watch("specialization");
  const watchSpecializations = useMemo(() => rawSpecializations ?? [], [rawSpecializations]);
  const isRepresentative = watch("isOrganizationRepresentative");

  useEffect(() => {
    if (isOpen && populationInfo) {
      reset({
        // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
        jobTitle: populationInfo.associate?.title || "",
        // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
        specialization: populationInfo.associate?.specialization || [],
        isOrganizationRepresentative: populationInfo.associate?.organization ? "yes" : "no",
        // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
        organizationName: populationInfo.associate?.organization || "",
      });
    }
  }, [isOpen, populationInfo, reset]);

  const toggleSpecialization = useCallback(
    (specialization: string) => {
      const currentSpecializations = [...watchSpecializations];
      const index = currentSpecializations.indexOf(specialization);

      if (index === -1) {
        currentSpecializations.push(specialization);
      } else {
        currentSpecializations.splice(index, 1);
      }

      setValue("specialization", currentSpecializations);
    },
    [setValue, watchSpecializations],
  );

  const onSubmit = useCallback<SubmitHandler<FormData>>(
    async (data) => {
      if (!firebaseUser) return;

      setError("");
      setSuccessMessage("");
      setLoading(true);

      try {
        const firebaseToken = await firebaseUser.getIdToken();

        const response = await updateAssociateInfo(firebaseToken, {
          jobTitle: data.jobTitle,
          specialization: data.specialization,
          isOrganizationRepresentative: data.isOrganizationRepresentative,
          // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
          organizationName: data.organizationName || "",
        });

        if (response.success) {
          setSuccessMessage(t("associate-information-updated"));
          await reloadUser();
          onClose();
        } else {
          setError(`${t("error-updating-info-colon")}: ${response.error}`);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : t("an-error-occurred"));
      } finally {
        setLoading(false);
      }
    },
    [firebaseUser, reloadUser, onClose, t],
  );

  const handleSave = useCallback(() => {
    void handleSubmit(onSubmit)();
  }, [handleSubmit, onSubmit]);

  const content = (
    <>
      <div className={styles.field}>
        <label className={styles.label}>{t("job-title-question")}</label>
        <input
          {...register("jobTitle")}
          className={styles.input}
          placeholder={t("job-title-placeholder")}
        />
        {errors.jobTitle && <span className={styles.error}>{errors.jobTitle.message}</span>}
      </div>

      <div className={styles.field}>
        <label className={styles.label}>{t("area-of-specialization")}</label>
        <Controller
          name="specialization"
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
        {errors.specialization && (
          <span className={styles.error}>{errors.specialization.message}</span>
        )}
      </div>

      <div className={styles.field}>
        <label className={styles.label}>{t("organization-representative-question")}</label>
        <div className={styles.radioGroup}>
          <Radio
            id="representative-yes"
            label={t("yes")}
            checked={isRepresentative === "yes"}
            onChange={() => {
              setValue("isOrganizationRepresentative", "yes");
            }}
          />
          <Radio
            id="representative-no"
            label={t("no")}
            checked={isRepresentative === "no"}
            onChange={() => {
              setValue("isOrganizationRepresentative", "no");
            }}
          />
        </div>
        {errors.isOrganizationRepresentative && (
          <span className={styles.error}>{errors.isOrganizationRepresentative.message}</span>
        )}
      </div>

      <div className={styles.field}>
        <label className={styles.label}>{t("organization-name-question")}</label>
        <input
          {...register("organizationName")}
          className={styles.input}
          placeholder={t("organization-name-placeholder")}
        />
        {errors.organizationName && (
          <span className={styles.error}>{errors.organizationName.message}</span>
        )}
      </div>
    </>
  );

  return (
    <>
      <Modal
        title={t("edit-associate-information")}
        content={content}
        isOpen={isOpen}
        onClose={onClose}
        onSave={handleSave}
        loading={loading}
      />
      {error && <p className={styles.errorMessage}>{error}</p>}
      {successMessage && (
        <SuccessMessage
          message={successMessage}
          onDismiss={() => {
            setSuccessMessage("");
          }}
        />
      )}
    </>
  );
};
