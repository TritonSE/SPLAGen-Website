"use client";

import { Radio } from "@tritonse/tse-constellation";
import { useStateMachine } from "little-state-machine";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useCallback, useState } from "react";
import { Controller, useForm } from "react-hook-form";

import styles from "./Student.module.css";

import type { CountryOption } from "@/components";

import { Button } from "@/components";
import { onboardingState } from "@/state/stateTypes";
import updateOnboardingForm from "@/state/updateOnboardingForm";

const CountrySelector = dynamic(() => import("@/components").then((mod) => mod.CountrySelector), {
  ssr: false,
});

type StudentProps = {
  onNext: (data: onboardingState["data"]) => void;
  onBack: () => void;
};

export const Student = ({ onNext, onBack }: StudentProps) => {
  const { state, actions } = useStateMachine({ actions: { updateOnboardingForm } });
  const [selectedCountry, setSelectedCountry] = useState<CountryOption | null>(null);

  const { register, handleSubmit, control, watch, setValue, reset } = useForm({
    defaultValues: state.onboardingForm,
  });

  const onSubmit = useCallback(
    (data: onboardingState["data"]) => {
      actions.updateOnboardingForm(data);
      // FORM VALIDATION FOR THE STUDENT EMAIL DO NOT CHECK FOR EDU NOT ALL STUDENT USERS WILL HAVE EDU
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

  const selectedDegree = watch("degree") || "";

  const handleDegreeSelection = useCallback(
    (value: string) => {
      setValue("degree", value);
    },
    [setValue],
  );

  const handleBack = useCallback(() => {
    const clearedData = {
      ...state.onboardingForm,
      schoolCountry: { value: "", label: "" },
      schoolName: "",
      universityEmail: "",
      degree: "",
      programName: "",
      graduationDate: "",
    };

    actions.updateOnboardingForm(clearedData);

    reset(clearedData);

    setSelectedCountry(null);

    onBack();
  }, [state.onboardingForm, actions, reset, onBack]);

  return (
    <div className={styles.container}>
      <form onSubmit={handleFormSubmit} className={styles.form}>
        <div>
          <h2 className={styles.title}>For Students</h2>
        </div>

        <div>
          <label className={styles.label}>School Location</label>
          <Controller
            name="schoolCountry"
            control={control}
            defaultValue={state.onboardingForm?.schoolCountry || ""}
            render={({ field }) => (
              <CountrySelector
                value={selectedCountry ?? state.onboardingForm?.schoolCountry}
                onChange={(option) => {
                  setSelectedCountry(option);
                  field.onChange(option);
                }}
              />
            )}
          />
        </div>

        <div>
          <label className={styles.label}>School Name</label>
          <input
            {...register("schoolName")}
            className={styles.input}
            placeholder="e.g., University of California, San Diego"
          />
        </div>

        <div>
          <label className={styles.label}>University Email</label>
          <input
            {...register("universityEmail")}
            className={styles.input}
            placeholder="Enter your school email"
            type="email"
          />
        </div>

        <div>
          <label className={styles.label}>Degree</label>
          <div className={styles.radioGroup}>
            <Radio
              id="degree-ms"
              label="MS"
              checked={selectedDegree === "MS"}
              onChange={() => {
                handleDegreeSelection("MS");
              }}
            />
            <Radio
              id="degree-phd"
              label="PhD"
              checked={selectedDegree === "PhD"}
              onChange={() => {
                handleDegreeSelection("PhD");
              }}
            />
            <Radio
              id="degree-md"
              label="MD"
              checked={selectedDegree === "MD"}
              onChange={() => {
                handleDegreeSelection("MD");
              }}
            />
          </div>
        </div>

        <div>
          <label className={styles.label}>Program Name or Department</label>
          <input {...register("programName")} className={styles.input} placeholder="Enter name" />
        </div>

        <div>
          <label className={styles.label}>Graduation Date</label>
          <input {...register("graduationDate")} className={styles.input} placeholder="MM/YY" />
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
