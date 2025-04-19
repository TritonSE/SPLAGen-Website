"use client";

import { Radio } from "@tritonse/tse-constellation";
import { useStateMachine } from "little-state-machine";
import Image from "next/image";
import { useCallback, useMemo } from "react";
import { Controller, useForm } from "react-hook-form";

import styles from "./Associate.module.css";

import { Button } from "@/components";
import { onboardingState } from "@/state/stateTypes";
import updateOnboardingForm from "@/state/updateOnboardingForm";

type AssociateProps = {
  onNext: (data: onboardingState["data"]) => void;
  onBack: () => void;
};

export const Associate = ({ onNext, onBack }: AssociateProps) => {
  const { state, actions } = useStateMachine({ actions: { updateOnboardingForm } });

  const specializations = [
    "Rare disease advocacy",
    "Research",
    "Public Health",
    "Bioethics",
    "Law",
    "Biology",
    "Medical Writer",
    "Medical Science Liaison",
    "Laboratory scientist",
    "Professor",
    "Bioinformatics",
    "Biotech sales and marketing",
  ];

  const { register, handleSubmit, control, watch, setValue, reset } = useForm({
    defaultValues: state.onboardingForm,
  });

  const onSubmit = useCallback(
    (data: onboardingState["data"]) => {
      actions.updateOnboardingForm(data);
      onNext(data);
    },
    [actions, onNext],
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

  const handleBack = useCallback(() => {
    const clearedData = {
      ...state.onboardingForm,
      jobTitle: "",
      specializations: [],
      isOrganizationRepresentative: "",
      organizationName: "",
    };

    actions.updateOnboardingForm(clearedData);

    reset(clearedData);

    onBack();
  }, [state.onboardingForm, actions, reset, onBack]);

  return (
    <div className={styles.container}>
      <form onSubmit={handleFormSubmit} className={styles.form}>
        <div>
          <h2 className={styles.title}>For Associate Members</h2>
        </div>

        <div>
          <label className={styles.label}>
            What is your job title or the name of the service you provide?
          </label>
          <input
            {...register("jobTitle")}
            className={styles.input}
            placeholder="e.g., Genetic Counselor"
          />
        </div>

        <div>
          <label className={styles.label}>Area of Specialization</label>
          <Controller
            name="specializations"
            control={control}
            defaultValue={[]}
            render={() => (
              <div className={styles.specializationContainer}>
                {specializations.map((specialization) => {
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
                      {specialization}
                    </button>
                  );
                })}
              </div>
            )}
          />
        </div>

        <div>
          <label className={styles.label}>Are you a representative of an organization?</label>
          <div className={styles.radioGroup}>
            <Radio
              id="representative-yes"
              label="Yes"
              checked={isRepresentative === "yes"}
              onChange={() => {
                handleRepresentativeSelection("yes");
              }}
            />
            <Radio
              id="representative-no"
              label="No"
              checked={isRepresentative === "no"}
              onChange={() => {
                handleRepresentativeSelection("no");
              }}
            />
          </div>
        </div>

        <div>
          <label className={styles.label}>
            If yes, what is the name of the organization you are representing?
          </label>
          <input
            {...register("organizationName")}
            className={styles.input}
            placeholder="Name of organization"
          />
        </div>

        <div className={styles.buttonContainer}>
          <button type="button" onClick={handleBack} className={styles.backButton}>
            <Image src="/icons/ic_caretleft.svg" alt="Back Icon" width={24} height={24} />
            Back
          </button>
          <Button type="submit" label="Continue" />
        </div>
      </form>
    </div>
  );
};
