"use client";

import { Radio } from "@tritonse/tse-constellation";
import { useStateMachine } from "little-state-machine";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useCallback, useState } from "react";
import { Controller, useForm } from "react-hook-form";

import styles from "./DirectoryBasics.module.css";

import type { CountryOption } from "@/components";

import { Button } from "@/components";
import { directoryState } from "@/state/stateTypes";
import updateDirectoryForm from "@/state/updateDirectoryForm";

const CountrySelector = dynamic(() => import("@/components").then((mod) => mod.CountrySelector), {
    ssr: false,
});

type DirectoryBasicsProps = {
    onNext: (data: directoryState["data"]) => void;
};

export const DirectoryBasics = ({ onNext }: DirectoryBasicsProps) => {
    const { state, actions } = useStateMachine({ actions: { updateDirectoryForm } });

    const [selectedCountry, setSelectedCountry] = useState<CountryOption | null>(null);

    const [educationType, setEducationType] = useState<string>(
        state.directoryForm?.educationType || ""
    );

    const { handleSubmit, control, register } = useForm<directoryState["data"]>({
        defaultValues: state.directoryForm,
    });

    const onSubmit = useCallback(
        (data: directoryState["data"]) => {
            actions.updateDirectoryForm(data);
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

    const handleContinue = useCallback(() => {
        void handleSubmit(onSubmit)();
    }, [handleSubmit, onSubmit]);

  return (
    <div className={styles.container}>
        <form onSubmit={handleFormSubmit} className={styles.form}>
            <div>
            <h4>Page 1 of 3</h4>
            <h3 className={styles.sectionTitle}>Education</h3>
            <p className={styles.sectionText}>
                What type of education have you received to practice in your profession?
            </p>

        <div className={styles.buttonGroup}>
            <Controller
              name="educationType"
              control={control}
              defaultValue={state.directoryForm?.educationType || ""}
              render={({ field }) => (
                <>
                  <Radio
                    id="education-1"
                    label="Master's Degree in Genetic Counseling"
                    checked={field.value === "masters"}
                    onChange={() => {
                      field.onChange("masters");
                      setEducationType("masters");
                    }}
                  />
                  <Radio
                    id="education-2"
                    label="Diploma in Genetic Counseling"
                    checked={field.value === "diploma"}
                    onChange={() => {
                      field.onChange("diploma");
                      setEducationType("diploma");
                    }}
                  />
                  <Radio
                    id="education-3"
                    label="Medical Fellowship in Genetics"
                    checked={field.value === "fellowship"}
                    onChange={() => {
                      field.onChange("fellowship");
                      setEducationType("fellowship");
                    }}
                  />
                  <Radio
                    id="education-4"
                    label="Other"
                    checked={field.value === "other"}
                    onChange={() => {
                      field.onChange("other");
                      setEducationType("other");
                    }}
                  />
                </>
              )}
            />
          </div>

          <div>
            <label className={styles.label}>
              Name of the institution where you obtained this education
            </label>
            <input
              type="text"
              {...register("educationInstitution")}
              className={styles.input}
              placeholder="Enter name of institution, e.g. University of California, San Diego"
            />
          </div>
        </div>

        <div>
          <h3 className={styles.sectionTitle}>Clinic</h3>
          <p className={styles.sectionText}>Name of work clinic</p>
          <p className={styles.sectionSubtext}>
            If you work in multiple locations, please specify only your main work location. We can only include one location per person.
          </p>

          <div>
            <input
              type="text"
              {...register("workClinic")}
              className={styles.input}
              placeholder="Enter name of work institution"
            />
          </div>

          <div>
            <label className={styles.label}>Clinic website link</label>
            <input
              type="text"
              {...register("clinicWebsite")}
              className={styles.input}
              placeholder="Enter website link"
            />
          </div>

          <div>
            <label className={styles.label}>Address of clinic</label>
            
            <div className={styles.addressField}>
              <label className={styles.label}>
                Country
                <span className={styles.optionalText}> (optional)</span>
              </label>
              <Controller
                name="clinicCountry"
                control={control}
                defaultValue={state.directoryForm?.clinicCountry || ""}
                render={({ field }) => (
                  <CountrySelector
                    value={selectedCountry ?? state.directoryForm?.clinicCountry}
                    onChange={(option) => {
                      setSelectedCountry(option);
                      field.onChange(option);
                    }}
                    placeholder="Select country"
                  />
                )}
              />
            </div>

            <div className={styles.addressField}>
              <input
                type="text"
                {...register("addressLine1")}
                className={styles.input}
                placeholder="Address line"
              />
            </div>

            <div className={styles.addressField}>
              <input
                type="text"
                {...register("addressLine2")}
                className={styles.input}
                placeholder="Apartment, suite, etc."
              />
            </div>

            <div className={styles.addressGridContainer}>
              <div className={styles.addressGrid}>
                <input
                  type="text"
                  {...register("city")}
                  className={styles.input}
                  placeholder="City"
                />
                <input
                  type="text"
                  {...register("state")}
                  className={styles.input}
                  placeholder="State/territory"
                />
                <input
                  type="text"
                  {...register("postcode")}
                  className={styles.input}
                  placeholder="Postcode"
                />
              </div>
            </div>
          </div>
        </div>

        <div className={styles.buttonContainer}>
          <button type="button" className={styles.backButton}>
            <Image src="/icons/ic_caretleft.svg" alt="Back Icon" width={24} height={24} />
            Back
          </button>

          <Button type="submit" onClick={handleContinue} label="Continue" />
        </div>
      </form>
    </div>
  );
};