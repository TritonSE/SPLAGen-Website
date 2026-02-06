"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Radio } from "@tritonse/tse-constellation";
import React, { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";

import styles from "./EditAssociateInfoModal.module.css";
import { Modal } from "./Modal";

import { User, updateAssociateInfo } from "@/api/users";
import { SuccessMessage } from "@/components/SuccessMessage";
import { SPECIALIZATIONS } from "@/constants/specializations";
import { UserContext } from "@/contexts/userContext";

const schema = z.object({
  jobTitle: z.string().min(1, "Job title is required"),
  specialization: z.array(z.string()).min(1, "Please select at least one specialization"),
  isOrganizationRepresentative: z.enum(["yes", "no"], {
    errorMap: () => ({ message: "Please select an option" }),
  }),
  organizationName: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

export const EditAssociateInfoModal = ({
  isOpen,
  onClose,
  populationInfo,
}: {
  isOpen: boolean;
  onClose: () => void;
  populationInfo: User | null;
}) => {
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
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
      const index = currentSpecializations.indexOf(specialization.toLowerCase());

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

        // Normalize specializations
        const specialization = data.specialization.map((s) => s.toLowerCase()).filter(Boolean);

        const response = await updateAssociateInfo(firebaseToken, {
          jobTitle: data.jobTitle,
          specialization,
          isOrganizationRepresentative: data.isOrganizationRepresentative,
          // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
          organizationName: data.organizationName || "",
        });

        if (response.success) {
          setSuccessMessage("Associate information updated successfully!");
          await reloadUser();
          onClose();
        } else {
          setError(`Error updating info: ${response.error}`);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    },
    [firebaseUser, reloadUser, onClose],
  );

  const handleSave = useCallback(() => {
    void handleSubmit(onSubmit)();
  }, [handleSubmit, onSubmit]);

  const content = (
    <>
      <div className={styles.field}>
        <label className={styles.label}>
          What is your job title or the name of the service you provide?
        </label>
        <input
          {...register("jobTitle")}
          className={styles.input}
          placeholder="e.g., Genetic Counselor"
        />
        {errors.jobTitle && <span className={styles.error}>{errors.jobTitle.message}</span>}
      </div>

      <div className={styles.field}>
        <label className={styles.label}>Area of Specialization</label>
        <Controller
          name="specialization"
          control={control}
          defaultValue={[]}
          render={() => (
            <div className={styles.specializationContainer}>
              {SPECIALIZATIONS.map((specialization) => {
                const isSelected = watchSpecializations.includes(specialization.toLowerCase());
                return (
                  <button
                    key={specialization}
                    type="button"
                    className={`${styles.specializationButton} ${isSelected ? styles.specializationButtonSelected : ""}`}
                    onClick={() => {
                      toggleSpecialization(specialization.toLowerCase());
                    }}
                  >
                    {specialization}
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
        <label className={styles.label}>Are you a representative of an organization?</label>
        <div className={styles.radioGroup}>
          <Radio
            id="representative-yes"
            label="Yes"
            checked={isRepresentative === "yes"}
            onChange={() => {
              setValue("isOrganizationRepresentative", "yes");
            }}
          />
          <Radio
            id="representative-no"
            label="No"
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
        <label className={styles.label}>
          If yes, what is the name of the organization you are representing?
        </label>
        <input
          {...register("organizationName")}
          className={styles.input}
          placeholder="Name of organization"
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
        title="Edit Associate Information"
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
