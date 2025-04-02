"use client";

import { Radio } from "@tritonse/tse-constellation";
import { useStateMachine } from "little-state-machine";
import dynamic from 'next/dynamic';
import { useCallback, useState } from "react";
import { Controller, useForm } from "react-hook-form";

import styles from "./Step2Student.module.css";

import type { CountryOption } from "@/components";

import { onboardingState } from "@/state/stateTypes";
import updateOnboardingForm from "@/state/updateOnboardingForm";

const CountrySelector = dynamic(() => import('@/components').then(mod => mod.CountrySelector), {
  ssr: false
});

type Step2StudentProps = {
  onNext: (data: onboardingState["data"]) => void;
  onBack: () => void;
};

export const Step2Student = ({ onNext, onBack }: Step2StudentProps) => {
  const { state, actions } = useStateMachine({ actions: { updateOnboardingForm } });
  const [selectedCountry, setSelectedCountry] = useState<CountryOption | null>(null);

  const { register, handleSubmit, control, watch, setValue } = useForm({
    defaultValues: state.onboardingForm,
  });

  const onSubmit = useCallback(
    (data: onboardingState["data"]) => {
      actions.updateOnboardingForm(data);
      onNext(data);
    },
    [actions.updateOnboardingForm, onNext],
  );

  const handleFormSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      void handleSubmit(onSubmit)();
    },
    [handleSubmit, onSubmit],
  );

  const selectedDegree = watch("degree") || "";
  
  const handleDegreeSelection = (value: string) => {
    setValue("degree", value);
  };

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
            placeholder="Enter your email ending in .edu"
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
              onChange={() => { handleDegreeSelection("MS"); }}
            />
            <Radio
              id="degree-phd"
              label="PhD"
              checked={selectedDegree === "PhD"}
              onChange={() => { handleDegreeSelection("PhD"); }}
            />
            <Radio
              id="degree-md"
              label="MD"
              checked={selectedDegree === "MD"}
              onChange={() => { handleDegreeSelection("MD"); }}
            />
          </div>
        </div>

        <div>
          <label className={styles.label}>Program Name or Department</label>
          <input
            {...register("programName")}
            className={styles.input}
            placeholder="Enter name"
          />
        </div>

        <div>
          <label className={styles.label}>Graduation Date</label>
          <input
            {...register("graduationDate")}
            className={styles.input}
            placeholder="MM/YY"
          />
        </div>

        <div className={styles.buttonContainer}>
          <button type="button" onClick={onBack} className={styles.backButton}>
            Back
          </button>
          <button type="submit" className={styles.continueButton}>
            Next
          </button>
        </div>
      </form>
    </div>
  );
};