"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import dynamic from "next/dynamic";
import Image from "next/image";
import React, { useCallback, useEffect } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import countryList from "react-select-country-list";
import { z } from "zod";

import ExitButton from "@/../public/icons/ExitButton.svg";
import "./ProfessionalInfoModal.css";
import { User, editProfessionalInfoRequest } from "@/api/users";
import { PillButton } from "@/components";

type professionalInfoProps = {
  isOpen: boolean;
  onClose: () => void;
  populationInfo: User;
};
const CountryOptions = countryList().getData();

const firebaseToken = "temp_firebase_token";
const languages = ["english", "spanish", "portuguese", "other"];

// Lazy load CountrySelector component to avoid hydration error
const CountrySelector = dynamic(() => import("@/components").then((mod) => mod.CountrySelector), {
  ssr: false,
});

// takes in a label or value and maps it to the CountryObject of type accepted by the form
const getCountryOption = (value?: string | null) => {
  value ??= "US"; // default to United States
  return CountryOptions.find((c) => c.value === value || c.label === value);
};

const ExitButtonSrc: string = ExitButton as unknown as string;

const countrySchema = (t: (key: string) => string) =>
  z.object({
    value: z.string().min(1, t("invalid-country-selection")),
    label: z.string().min(1),
  });

export const professionalInfoSchema = (t: (key: string) => string) =>
  z.object({
    professionalTitle: z.string().min(1, t("professional-title-required")),
    country: countrySchema(t).optional(),
    languages: z.array(z.string()).nonempty(t("one-language-required")),
    splagenDirectory: z.boolean(),
  });

type ProfessionalInfoFormData = z.infer<ReturnType<typeof professionalInfoSchema>>;

export const ProfessionalInfoModal = ({
  isOpen,
  onClose,
  populationInfo,
}: professionalInfoProps) => {
  const { t } = useTranslation();
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    watch,
    reset,
    setValue,
    setError,
  } = useForm<ProfessionalInfoFormData>({
    resolver: zodResolver(professionalInfoSchema(t)),
    defaultValues: {
      professionalTitle: populationInfo?.professional.title,
      country: getCountryOption(populationInfo?.professional.country),
      languages: populationInfo?.professional.prefLanguages,
      splagenDirectory: populationInfo?.account.inDirectory === true,
    },
  });

  const watchedLanguages = watch("languages");
  const selectedLanguages = React.useMemo(
    () => watchedLanguages || ["english"],
    [watchedLanguages],
  );

  const toggleLanguage = useCallback(
    (language: string) => {
      const updatedLanguages = selectedLanguages.includes(language)
        ? selectedLanguages.filter((lang) => lang !== language)
        : [...selectedLanguages, language];

      // Default to English if no language is selected
      if (updatedLanguages.length === 0) {
        setError("languages", {
          type: "manual",
          message: t("one-language-required-default-english"),
        });
      }

      setValue(
        "languages",
        updatedLanguages.length ? (updatedLanguages as [string, ...string[]]) : ["english"],
      );
    },
    [selectedLanguages, setValue, setError, t],
  );

  // Sends form data to backend
  const onSubmit = useCallback<SubmitHandler<ProfessionalInfoFormData>>(
    async (data) => {
      // backend expectsto have 'new' in the beginning of keys
      const formattedData = {
        newTitle: data.professionalTitle,
        newPrefLanguages: data.languages as ("english" | "spanish" | "portuguese" | "other")[],
        newOtherPrefLanguages: "",
        newCountry: data.country?.label ?? "",
      };

      const response = await editProfessionalInfoRequest(formattedData, firebaseToken);
      if (response.success) {
        onClose();
      }
    },
    [onClose],
  );

  // Populates form inputs when modal is opened
  useEffect(() => {
    if (isOpen && populationInfo) {
      reset({
        professionalTitle: populationInfo.professional.title,
        country: getCountryOption(populationInfo.professional.country),
        languages: populationInfo.professional.prefLanguages,
        splagenDirectory: populationInfo.account.inDirectory === true,
      });
    }
  }, [isOpen, populationInfo, reset]);

  const handleFormSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      void handleSubmit(onSubmit)();
    },
    [handleSubmit, onSubmit],
  );

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <button className="close-button" onClick={onClose}>
          <Image src={ExitButtonSrc} alt="Exit" />
        </button>
        <h2 id="prof-info-h2">{t("edit-professional-info")}</h2>
        <form className="prof-info-form" onSubmit={handleFormSubmit}>
          {/* Professional Title */}
          <div className="prof-info-field">
            <label htmlFor="professionalTitle">
              {t("professional-title")}
              <span className="red-text">*</span>
            </label>
            <input
              type="text"
              id="professionalTitle"
              placeholder={t("professional-title-placeholder")}
              {...register("professionalTitle")}
            />
            <p className="error-message">{errors.professionalTitle?.message ?? "\u00A0"}</p>
          </div>

          {/* Country */}
          <div className="prof-info-field">
            <label>{t("country")}</label>
            <Controller
              control={control}
              name="country"
              render={({ field }) => (
                <CountrySelector
                  value={field.value ?? null}
                  onChange={field.onChange}
                  placeholder={t("country-ellipsis")}
                />
              )}
            />
            <p className="error-message">{errors.country?.message ?? "\u00A0"}</p>
          </div>

          {/* Languages */}
          <div className="prof-info-field">
            <label htmlFor="languages">
              {t("preferred-language")}
              <span className="red-text">*</span>
            </label>
            <div className="language-options">
              {languages.map((language) => (
                <PillButton
                  label={t(language)}
                  key={language}
                  isActive={selectedLanguages.includes(language)}
                  onClick={() => {
                    toggleLanguage(language);
                  }}
                />
              ))}
            </div>
            <p className="error-message">
              {errors.languages?.message && typeof errors.languages.message === "string"
                ? errors.languages.message
                : "\u00A0"}
            </p>
          </div>

          {/* SPLAGen Directory */}
          <div className="prof-info-field no-error-message-field">
            <label>
              {t("splagen-directory")}
              <span className="red-text">*</span>
            </label>
            <p>{watch("splagenDirectory") ? t("yes") : t("no")}</p>
          </div>
          <button type="submit" id="prof-info-submit" className="button">
            {t("save")}
          </button>
        </form>
      </div>
    </div>
  );
};
