/* eslint-disable @typescript-eslint/no-unnecessary-boolean-literal-compare */
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Radio } from "@tritonse/tse-constellation";
import { useStateMachine } from "little-state-machine";
import Image from "next/image";
import { useCallback, useMemo } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

import styles from "./DirectoryServices.module.css";

import { Button } from "@/components";
import { directoryState } from "@/state/stateTypes";
import updateDirectoryForm from "@/state/updateDirectoryForm";

const specialtyOptions = [
  "Pediatric Genetics",
  "Cardiovascular Genetics",
  "Neurogenetics",
  "Rare Diseases",
  "Cancer Genetics",
  "Biochemical Genetics",
  "Prenatal Genetics",
  "Adult Genetics",
  "Psychiatric Genetics",
  "Assisted Reproductive Technologies and Preimplantation Genetic Testing",
  "Ophthalmic Genetics",
  "Research",
  "Pharmacogenomics",
  "Metabolic Genetics",
  "Other",
];

const languageOptions = ["English", "Spanish", "Portuguese", "Other"];

const formSchema = z.object({
  canMakeAppointments: z.boolean({ required_error: "Required" }),
  canRequestTests: z.boolean({ required_error: "Required" }),
  offersTelehealth: z.boolean({ required_error: "Required" }),
  specialtyServices: z.array(z.string()).min(1, "Please select at least one specialty service"),
  careLanguages: z.array(z.string()).min(1, "Required"),
  authorizedForLanguages: z.union([z.boolean(), z.literal("unsure")]),
});

type FormSchema = z.infer<typeof formSchema>;

type DirectoryServicesProps = {
  onNext: (data: directoryState["data"]) => void;
  onBack: () => void;
};

export const DirectoryServices = ({ onNext, onBack }: DirectoryServicesProps) => {
  const { state, actions } = useStateMachine({ actions: { updateDirectoryForm } });

  const {
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormSchema>({
    defaultValues: state.directoryForm as FormSchema,
    resolver: zodResolver(formSchema),
  });

  const rawSpecialtyServices = watch("specialtyServices");
  const watchSpecialtyServices = useMemo(() => rawSpecialtyServices || [], [rawSpecialtyServices]);

  const rawCareLanguages = watch("careLanguages");
  const watchCareLanguages = useMemo(() => rawCareLanguages || [], [rawCareLanguages]);

  const toggleSpecialty = useCallback(
    (specialty: string) => {
      const currentSpecialties = [...watchSpecialtyServices];
      const index = currentSpecialties.indexOf(specialty);

      if (index === -1) {
        currentSpecialties.push(specialty);
      } else {
        currentSpecialties.splice(index, 1);
      }

      setValue("specialtyServices", currentSpecialties);
    },
    [setValue, watchSpecialtyServices],
  );

  const toggleLanguage = useCallback(
    (language: string) => {
      const currentLanguages = [...watchCareLanguages];
      const index = currentLanguages.indexOf(language);

      if (index === -1) {
        currentLanguages.push(language);
      } else {
        currentLanguages.splice(index, 1);
      }

      setValue("careLanguages", currentLanguages);
    },
    [setValue, watchCareLanguages],
  );

  const onSubmit = useCallback(
    (data: FormSchema) => {
      actions.updateDirectoryForm(data as directoryState["data"]);
      onNext(data as directoryState["data"]);
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

  return (
    <div className={styles.container}>
      <form onSubmit={handleFormSubmit} className={styles.form}>
        <div>
          <h4>Page 2 of 3</h4>
          <h3 className={styles.sectionTitle}>Services</h3>

          <div className={styles.questionSection}>
            <p className={styles.sectionText}>Can patients make appointments for your services?</p>
            <div className={styles.radioGroup}>
              <Controller
                name="canMakeAppointments"
                control={control}
                render={({ field }) => (
                  <>
                    <Radio
                      id="appointments-yes"
                      label="Yes"
                      checked={field.value === true}
                      onChange={() => {
                        field.onChange(true);
                      }}
                    />
                    <Radio
                      id="appointments-no"
                      label="No"
                      checked={field.value === false}
                      onChange={() => {
                        field.onChange(false);
                      }}
                    />
                  </>
                )}
              />
              <p className={styles.errorText}>
                {errors.canMakeAppointments ? errors.canMakeAppointments.message : "\u00A0"}
              </p>
            </div>
          </div>

          <div className={styles.questionSection}>
            <p className={styles.sectionText}>
              Can patients request genetic tests through your services?
            </p>
            <div className={styles.radioGroup}>
              <Controller
                name="canRequestTests"
                control={control}
                render={({ field }) => (
                  <>
                    <Radio
                      id="tests-yes"
                      label="Yes"
                      checked={field.value === true}
                      onChange={() => {
                        field.onChange(true);
                      }}
                    />
                    <Radio
                      id="tests-no"
                      label="No"
                      checked={field.value === false}
                      onChange={() => {
                        field.onChange(false);
                      }}
                    />
                  </>
                )}
              />
              <p className={styles.errorText}>
                {errors.canRequestTests ? errors.canRequestTests.message : "\u00A0"}
              </p>
            </div>
          </div>

          <div className={styles.questionSection}>
            <p className={styles.sectionText}>
              Do you offer remote medical services (e.g. telehealth)?
            </p>
            <div className={styles.radioGroup}>
              <Controller
                name="offersTelehealth"
                control={control}
                render={({ field }) => (
                  <>
                    <Radio
                      id="telehealth-yes"
                      label="Yes"
                      checked={field.value === true}
                      onChange={() => {
                        field.onChange(true);
                      }}
                    />
                    <Radio
                      id="telehealth-no"
                      label="No"
                      checked={field.value === false}
                      onChange={() => {
                        field.onChange(false);
                      }}
                    />
                  </>
                )}
              />
              <p className={styles.errorText}>
                {errors.offersTelehealth ? errors.offersTelehealth.message : "\u00A0"}
              </p>
            </div>
          </div>

          <div className={styles.questionSection}>
            <p className={styles.sectionText}>
              Please indicate the genetic specialty services you offer
            </p>
            <Controller
              name="specialtyServices"
              control={control}
              defaultValue={[]}
              render={() => (
                <div className={styles.specialtyGrid}>
                  {specialtyOptions.map((specialty) => {
                    const isSelected = watchSpecialtyServices.includes(specialty);
                    return (
                      <button
                        key={specialty}
                        type="button"
                        className={`${styles.specialtyButton} ${isSelected ? styles.specialtyButtonSelected : ""}`}
                        onClick={() => {
                          toggleSpecialty(specialty);
                        }}
                      >
                        {specialty}
                      </button>
                    );
                  })}
                </div>
              )}
            />
            <p className={styles.errorText}>
              {errors.specialtyServices ? errors.specialtyServices.message : "\u00A0"}
            </p>
          </div>

          <div className={styles.questionSection}>
            <p className={styles.sectionText}>Language(s) used for patient care:</p>
            <Controller
              name="careLanguages"
              control={control}
              defaultValue={[]}
              render={() => (
                <div className={styles.languageContainer}>
                  {languageOptions.map((language) => {
                    const isSelected = watchCareLanguages.includes(language);
                    return (
                      <button
                        key={language}
                        type="button"
                        className={`${styles.specialtyButton} ${isSelected ? styles.specialtyButtonSelected : ""}`}
                        onClick={() => {
                          toggleLanguage(language);
                        }}
                      >
                        {language}
                      </button>
                    );
                  })}
                </div>
              )}
            />
            <p className={styles.errorText}>
              {errors.careLanguages ? errors.careLanguages.message : "\u00A0"}
            </p>
          </div>

          <div className={styles.questionSection}>
            <p className={styles.sectionText}>
              Based on your state health institutions and policies, are you authorized to provide
              care in the languages mentioned above:
            </p>
            <div className={styles.radioGroup}>
              <Controller
                name="authorizedForLanguages"
                control={control}
                render={({ field }) => (
                  <>
                    <Radio
                      id="authorized-yes"
                      label="Yes"
                      checked={field.value === true}
                      onChange={() => {
                        field.onChange(true);
                      }}
                    />
                    <Radio
                      id="authorized-no"
                      label="No"
                      checked={field.value === false}
                      onChange={() => {
                        field.onChange(false);
                      }}
                    />
                    <Radio
                      id="authorized-unsure"
                      label="I'm not sure"
                      checked={field.value === "unsure"}
                      onChange={() => {
                        field.onChange("unsure");
                      }}
                    />
                  </>
                )}
              />
              <p className={styles.errorText}>
                {errors.authorizedForLanguages ? errors.authorizedForLanguages.message : "\u00A0"}
              </p>
            </div>
          </div>
        </div>

        <div className={styles.buttonContainer}>
          <button type="button" className={styles.backButton} onClick={onBack}>
            <Image src="/icons/ic_caretleft.svg" alt="Back Icon" width={24} height={24} />
            Back
          </button>

          <Button type="submit" label="Continue" />
        </div>
      </form>
    </div>
  );
};
