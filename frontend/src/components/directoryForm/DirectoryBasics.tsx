"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Radio } from "@tritonse/tse-constellation";
import { useStateMachine } from "little-state-machine";
import dynamic from "next/dynamic";
import { useCallback, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";

import styles from "./DirectoryBasics.module.css";

import type { CountryOption } from "@/components";

import { Button } from "@/components";
import { educationTypeOptions } from "@/components/modals/displayInfoConstants";
import { directoryState } from "@/state/stateTypes";
import updateDirectoryForm from "@/state/updateDirectoryForm";

const CountrySelector = dynamic(() => import("@/components").then((mod) => mod.CountrySelector), {
  ssr: false,
});

const formSchema = (t: (key: string) => string) =>
  z.object({
    educationType: z.string().min(1, t("select-education-type")),
    educationInstitution: z.string().min(1, t("institution-name-required")),
    workClinic: z.string().min(1, t("work-clinic-name-required")),
    clinicWebsite: z.string().url(t("valid-website-url")),
    addressLine1: z.string().min(1, t("address-required")),
    addressLine2: z.string().optional(),
    city: z.string().min(1, t("city-required")),
    state: z.string().min(1, t("state-territory-required")),
    postcode: z.string().min(1, t("postcode-required")),
    clinicCountry: z.object({
      value: z.string().min(1),
      label: z.string().min(1),
    }),
  });

type FormSchema = z.infer<ReturnType<typeof formSchema>>;

type DirectoryBasicsProps = {
  onNext: (data: directoryState["data"]) => void;
};

export const DirectoryBasics = ({ onNext }: DirectoryBasicsProps) => {
  const { t } = useTranslation();
  const { state, actions } = useStateMachine({ actions: { updateDirectoryForm } });

  const [selectedCountry, setSelectedCountry] = useState<CountryOption | null>(null);

  const {
    handleSubmit,
    control,
    register,
    formState: { errors },
  } = useForm<FormSchema>({
    defaultValues: state.directoryForm as FormSchema,
    resolver: zodResolver(formSchema(t)),
  });

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
          <h4>{t("page-1-of-3")}</h4>
          <h3 className={styles.sectionTitle}>{t("education")}</h3>
          <p className={styles.sectionText}>{t("education-received-question")}</p>

          <div className={styles.buttonGroup}>
            <Controller
              name="educationType"
              control={control}
              defaultValue={state.directoryForm?.educationType || ""}
              render={({ field }) => (
                <>
                  {educationTypeOptions.map(({ label, value }) => (
                    <Radio
                      key={label}
                      id={`education-${label}`}
                      label={t(label)}
                      checked={field.value === value}
                      onChange={() => {
                        field.onChange(value);
                      }}
                    />
                  ))}
                </>
              )}
            />
            <p className={styles.errorText}>
              {errors.educationType ? errors.educationType.message : "\u00A0"}
            </p>
          </div>

          <div>
            <label className={styles.label}>{t("institution-name-label")}</label>
            <input
              type="text"
              {...register("educationInstitution")}
              className={styles.input}
              placeholder={t("institution-name-placeholder")}
            />
            <p className={styles.errorText}>
              {errors.educationInstitution ? errors.educationInstitution.message : "\u00A0"}
            </p>
          </div>
        </div>

        <div>
          <h3 className={styles.sectionTitle}>{t("clinic")}</h3>
          <p className={styles.sectionText}>{t("name-of-work-clinic")}</p>
          <p className={styles.sectionSubtext}>{t("multiple-locations-note")}</p>

          <div>
            <input
              type="text"
              {...register("workClinic")}
              className={styles.input}
              placeholder={t("work-institution-placeholder")}
            />
            <p className={styles.errorText}>
              {errors.workClinic ? errors.workClinic.message : "\u00A0"}
            </p>
          </div>

          <div>
            <label className={styles.label}>{t("clinic-website-link")}</label>
            <input
              type="text"
              {...register("clinicWebsite")}
              className={styles.input}
              placeholder={t("enter-website-link")}
            />
            <p className={styles.errorText}>
              {errors.clinicWebsite ? errors.clinicWebsite.message : "\u00A0"}
            </p>
          </div>

          <div>
            <label className={styles.label}>{t("address-of-clinic")}</label>

            <div className={styles.addressField}>
              <label className={styles.label}>{t("country")}</label>
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
                    placeholder={t("select-country")}
                  />
                )}
              />
              {errors.clinicCountry && (
                <p className={styles.errorText}>{errors.clinicCountry.message}</p>
              )}
            </div>

            <div className={styles.addressField}>
              <input
                type="text"
                {...register("addressLine1")}
                className={styles.input}
                placeholder={t("address-line")}
              />
              {errors.addressLine1 && (
                <p className={styles.errorText}>{errors.addressLine1.message}</p>
              )}
            </div>

            <div className={styles.addressField}>
              <input
                type="text"
                {...register("addressLine2")}
                className={styles.input}
                placeholder={t("apartment-suite-etc")}
              />
            </div>

            <div className={styles.addressGridContainer}>
              <div className={styles.addressGrid}>
                <div>
                  <input
                    type="text"
                    {...register("city")}
                    className={styles.input}
                    placeholder={t("city")}
                  />
                  <p className={styles.errorText}>{errors.city ? errors.city.message : "\u00A0"}</p>
                </div>
                <div>
                  <input
                    type="text"
                    {...register("state")}
                    className={styles.input}
                    placeholder={t("state-territory")}
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
                    placeholder={t("postcode")}
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
          <Button type="submit" label={t("continue")} />
        </div>
      </form>
    </div>
  );
};
