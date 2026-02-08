"use client";

import { useStateMachine } from "little-state-machine";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useCallback, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

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

  const { register, handleSubmit, control } = useForm<onboardingState["data"]>({
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

  const languageOptions = [
    { value: "ES", label: t("spanish") },
    { value: "EN", label: t("english") },
    { value: "PT", label: t("portuguese") },
    { value: "OTH", label: t("other") },
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
        </div>

        <div className={styles.membershipSection}>
          <h3 className={styles.sectionTitle}>{t("membership-section-title")}</h3>
          <p className={styles.sectionText}>{t("membership-section-text")}</p>

          <h4 className={styles.membershipLabel}>{t("membership-genetic-counselor")}</h4>
          <ExpandableSection
            title={t("membership-genetic-counselor-title")}
            content={t("membership-genetic-counselor-desc")}
          />

          <h4 className={styles.membershipLabel}>{t("membership-healthcare-provider")}</h4>
          <ExpandableSection
            title={t("membership-healthcare-provider-title")}
            content={t("membership-healthcare-provider-desc")}
          />

          <h4 className={styles.membershipLabel}>{t("membership-associate")}</h4>
          <ExpandableSection
            title={t("membership-associate-title")}
            content={t("membership-associate-desc")}
          />

          <h4 className={styles.membershipLabel}>{t("membership-student")}</h4>
          <ExpandableSection
            title={t("membership-student-title")}
            content={t("membership-student-desc")}
          />
        </div>

        <div className={styles.buttonContainer}>
          <button type="button" onClick={onBack} className={styles.backButton}>
            <Image src="/icons/ic_caretleft.svg" alt="Back Icon" width={24} height={24} />
            {t("back")}
          </button>

          <Button type="submit" label={t("continue")} />
        </div>
      </form>
    </div>
  );
};
