"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useStateMachine } from "little-state-machine";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useCallback, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";

import styles from "./Basics.module.css";

import type { CountryOption, ProfessionalTitleOption } from "@/components";

import { Button, Checkmark, ExpandableSection } from "@/components";
import { onboardingState } from "@/state/stateTypes";
import updateOnboardingForm from "@/state/updateOnboardingForm";

const CountrySelector = dynamic(() => import("@/components").then((mod) => mod.CountrySelector), {
  ssr: false,
});

const ProfessionalTitleSelector = dynamic(
  () => import("@/components").then((mod) => mod.ProfessionalTitleSelector),
  {
    ssr: false,
  },
);

const formSchema = (t: (key: string) => string) =>
  z.object({
    professionalTitle: z.object({
      value: z.string().min(1, t("professional-title-required")),
      label: z.string(),
    }),
    professionalTitleOther: z.string().optional(),
    country: z.object({
      value: z.string().min(1, t("country-required")),
      label: z.string(),
    }),
    language: z.string().min(1, t("preferred-language-required")),
  });

type FormData = {
  professionalTitle: {
    value: string;
    label: string;
  };
  professionalTitleOther?: string;
  country: {
    value: string;
    label: string;
  };
  language: string;
};

type BasicsProps = {
  onNext: (data: onboardingState["data"]) => void;
  onBack: () => void;
};

export const Basics = ({ onNext, onBack }: BasicsProps) => {
  const { t } = useTranslation();
  const { state, actions } = useStateMachine({ actions: { updateOnboardingForm } });

  const [selectedCountry, setSelectedCountry] = useState<CountryOption | null>(null);

  const [selectedProfessionalTitle, setSelectedProfessionalTitle] =
    useState<ProfessionalTitleOption | null>(null);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isValid },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema(t)),
    defaultValues: state.onboardingForm,
    mode: "onChange",
  });
  console.log(errors, isValid);

  const onSubmit = useCallback(
    (data: FormData) => {
      actions.updateOnboardingForm({
        ...state.onboardingForm,
        ...data,
      });
      onNext({
        ...state.onboardingForm,
        ...data,
      });
    },
    [actions, onNext, state.onboardingForm],
  );

  const handleFormSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      void handleSubmit(onSubmit)();
    },
    [handleSubmit, onSubmit],
  );

  const languageOptions = [
    { value: "ES", label: t("spanish") },
    { value: "EN", label: t("english") },
    { value: "PT", label: t("portuguese") },
  ];

  return (
    <div className={styles.container}>
      <form onSubmit={handleFormSubmit} className={styles.form}>
        <div>
          <h2 className={styles.title}>{t("basics-title")}</h2>
          <p className={styles.subtitle}>{t("basics-subtitle")}</p>
        </div>

        <div>
          <label className={styles.label}>{t("professional-title")}</label>
          <Controller
            name="professionalTitle"
            control={control}
            defaultValue={state.onboardingForm?.professionalTitle || ""}
            render={({ field }) => (
              <ProfessionalTitleSelector
                value={selectedProfessionalTitle ?? state.onboardingForm?.professionalTitle}
                onChange={(option) => {
                  setSelectedProfessionalTitle(option);
                  field.onChange(option);
                }}
              />
            )}
          />
          <p className={styles.errorText}>
            {errors.professionalTitle ? errors.professionalTitle.message : "\u00A0"}
          </p>
        </div>

        {selectedProfessionalTitle?.value === "other" && (
          <div>
            <label className={styles.label}>{t("please-specify")}</label>
            <Controller
              name="professionalTitleOther"
              control={control}
              defaultValue={state.onboardingForm?.professionalTitleOther || ""}
              render={() => (
                <input
                  {...register("professionalTitleOther")}
                  className={styles.input}
                  placeholder={t("please-specify")}
                />
              )}
            />
            <p className={styles.errorText}>
              {errors.professionalTitleOther ? errors.professionalTitleOther.message : "\u00A0"}
            </p>
          </div>
        )}

        <div>
          <label className={styles.label}>
            {t("country")}
            <span className={styles.optionalText}> {t("optional")}</span>
          </label>
          <Controller
            name="country"
            control={control}
            defaultValue={state.onboardingForm?.country || ""}
            render={({ field }) => (
              <CountrySelector
                value={selectedCountry ?? state.onboardingForm?.country}
                onChange={(option) => {
                  setSelectedCountry(option);
                  field.onChange(option);
                }}
                placeholder={t("select-country")}
              />
            )}
          />
          <p className={styles.errorText}>{errors.country ? errors.country.message : "\u00A0"}</p>
        </div>

        <div>
          <label className={styles.label}>{t("preferred-language")}</label>
          <Controller
            name="language"
            control={control}
            defaultValue=""
            render={({ field: { onChange, value = "" } }) => (
              <div className={styles.languageGrid}>
                {languageOptions.map((option) => {
                  const isChecked = value === option.value;
                  return (
                    <div key={option.value} className={styles.checkboxItem}>
                      <Checkmark
                        checked={isChecked}
                        onChange={() => {
                          // Only allow one language to be selected at a time
                          onChange(option.value);
                        }}
                        label={option.label}
                      />
                    </div>
                  );
                })}
              </div>
            )}
          />
          <p className={styles.errorText}>{errors.language ? errors.language.message : "\u00A0"}</p>
        </div>

        <div className={styles.membershipSection}>
          <h3 className={styles.sectionTitle}>{t("membership-section-title")}</h3>
          <p className={styles.sectionText}>{t("membership-section-text")}</p>

          <h4 className={styles.membershipLabel}>{t("membership-genetic-counselor")}</h4>
          <ExpandableSection
            title={t("membership-genetic-counselor-title")}
            content={t("membership-genetic-counselor-desc")}
          />

          <h4 className={styles.membershipLabel}>{t("membership-other-genetics-professional")}</h4>
          <ExpandableSection
            title={t("membership-other-genetics-professional-title")}
            content={t("membership-other-genetics-professional-desc")}
          />

          <h4 className={styles.membershipLabel}>{t("membership-healthcare-professional")}</h4>
          <ExpandableSection
            title={t("membership-healthcare-professional-title")}
            content={t("membership-healthcare-professional-desc")}
          />

          <h4 className={styles.membershipLabel}>{t("membership-student")}</h4>
          <ExpandableSection
            title={t("membership-student-title")}
            content={t("membership-student-desc")}
          />

          <h4 className={styles.membershipLabel}>{t("membership-associate")}</h4>
          <ExpandableSection
            title={t("membership-associate-title")}
            content={t("membership-associate-desc")}
          />
        </div>

        <div className={styles.buttonContainer}>
          <button type="button" onClick={onBack} className={styles.backButton}>
            <Image src="/icons/ic_caretleft.svg" alt="Back Icon" width={24} height={24} />
            {t("back")}
          </button>

          <Button type="submit" disabled={!isValid} label={t("continue")} />
        </div>
      </form>
    </div>
  );
};
