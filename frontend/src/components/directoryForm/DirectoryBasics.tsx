"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Radio } from "@tritonse/tse-constellation";
import { useStateMachine } from "little-state-machine";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useCallback, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

import styles from "./DirectoryBasics.module.css";

import type { CountryOption } from "@/components";

import { Button } from "@/components";
import { directoryState } from "@/state/stateTypes";
import updateDirectoryForm from "@/state/updateDirectoryForm";

const CountrySelector = dynamic(() => import("@/components").then((mod) => mod.CountrySelector), {
  ssr: false,
});

const formSchema = z.object({
  educationType: z.string().min(1, "Please select an education type"),
  educationInstitution: z.string().min(1, "Institution name is required"),
  workClinic: z.string().min(1, "Work clinic name is required"),
  clinicWebsite: z.string().url("Please enter a valid website URL"),
  addressLine1: z.string().min(1, "Address is required"),
  addressLine2: z.string().optional(),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State/territory is required"),
  postcode: z.string().min(1, "Postcode is required"),
  clinicCountry: z.custom<CountryOption>().optional(),
});

type FormSchema = z.infer<typeof formSchema>;

type DirectoryBasicsProps = {
  onNext: (data: directoryState["data"]) => void;
};

export const DirectoryBasics = ({ onNext }: DirectoryBasicsProps) => {
  const { state, actions } = useStateMachine({ actions: { updateDirectoryForm } });

  const [selectedCountry, setSelectedCountry] = useState<CountryOption | null>(null);

  const {
    handleSubmit,
    control,
    register,
    formState: { errors },
  } = useForm<FormSchema>({
    defaultValues: state.directoryForm as FormSchema,
    resolver: zodResolver(formSchema),
  });

  const onSubmit = useCallback(
    (data: FormSchema) => {
      actions.updateDirectoryForm(data);
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
          <h4>Page 1 of 3</h4>
          <h3 className={styles.sectionTitle}>Education</h3>
          <p className={styles.sectionText}>
            What type of education have you received to practice in your profession?
          </p>

          <div className={styles.buttonGroup}>
            <Controller
              name="educationType"
              control={control}
              defaultValue={state.directoryForm?.educationType ?? ""}
              render={({ field }) => (
                <>
                  <Radio
                    id="education-1"
                    label="Master's Degree in Genetic Counseling"
                    checked={field.value === "masters"}
                    onChange={() => {
                      field.onChange("masters");
                    }}
                  />
                  <Radio
                    id="education-2"
                    label="Diploma in Genetic Counseling"
                    checked={field.value === "diploma"}
                    onChange={() => {
                      field.onChange("diploma");
                    }}
                  />
                  <Radio
                    id="education-3"
                    label="Medical Fellowship in Genetics"
                    checked={field.value === "fellowship"}
                    onChange={() => {
                      field.onChange("fellowship");
                    }}
                  />
                  <Radio
                    id="education-4"
                    label="Other"
                    checked={field.value === "other"}
                    onChange={() => {
                      field.onChange("other");
                    }}
                  />
                </>
              )}
            />
            <p className={styles.errorText}>
              {errors.educationType ? errors.educationType.message : "\u00A0"}
            </p>
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
            <p className={styles.errorText}>
              {errors.educationInstitution ? errors.educationInstitution.message : "\u00A0"}
            </p>
          </div>
        </div>

        <div>
          <h3 className={styles.sectionTitle}>Clinic</h3>
          <p className={styles.sectionText}>Name of work clinic</p>
          <p className={styles.sectionSubtext}>
            If you work in multiple locations, please specify only your main work location. We can
            only include one location per person.
          </p>

          <div>
            <input
              type="text"
              {...register("workClinic")}
              className={styles.input}
              placeholder="Enter name of work institution"
            />
            <p className={styles.errorText}>
              {errors.workClinic ? errors.workClinic.message : "\u00A0"}
            </p>
          </div>

          <div>
            <label className={styles.label}>Clinic website link</label>
            <input
              type="text"
              {...register("clinicWebsite")}
              className={styles.input}
              placeholder="Enter website link: https://www.example.com"
            />
            <p className={styles.errorText}>
              {errors.clinicWebsite ? errors.clinicWebsite.message : "\u00A0"}
            </p>
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
                defaultValue={state.directoryForm?.clinicCountry}
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

            <div>
              <input
                type="text"
                {...register("addressLine1")}
                className={styles.input}
                placeholder="Address line"
              />
              <p className={styles.errorText}>
                {errors.addressLine1 ? errors.addressLine1.message : "\u00A0"}
              </p>
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
                <div>
                  <input
                    type="text"
                    {...register("city")}
                    className={styles.input}
                    placeholder="City"
                  />
                  <p className={styles.errorText}>{errors.city ? errors.city.message : "\u00A0"}</p>
                </div>
                <div>
                  <input
                    type="text"
                    {...register("state")}
                    className={styles.input}
                    placeholder="State/territory"
                  />
                  <p className={styles.errorText}>
                    {errors.state ? errors.state.message : "\u00A0"}
                  </p>
                </div>
                <div>
                  <input
                    type="text"
                    {...register("postcode")}
                    className={styles.input}
                    placeholder="Postcode"
                  />
                  <p className={styles.errorText}>
                    {errors.postcode ? errors.postcode.message : "\u00A0"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.buttonContainer}>
          <button type="button" className={styles.backButton}>
            <Image src="/icons/ic_caretleft.svg" alt="Back Icon" width={24} height={24} />
            Back
          </button>

          <Button type="submit" label="Continue" />
        </div>
      </form>
    </div>
  );
};
