"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import dynamic from "next/dynamic";
import Image from "next/image";
import React, { useCallback } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";

import ExitButton from "@/../public/icons/ExitButton.svg";
import "./ProfessionalInfoModal.css";
import { PillButton } from "@/components";

// Lazy load CountrySelector component to avoid hydration error
const CountrySelector = dynamic(() => import("@/components").then((mod) => mod.CountrySelector), {
  ssr: false,
});

const ExitButtonSrc: string = ExitButton as unknown as string;

const countrySchema = (t: (key: string) => string) =>
  z.object({
    value: z.string().min(1, t("invalid-country-selection")),
    label: z.string().min(1),
  });

const professionalInfoSchema = (t: (key: string) => string) =>
  z.object({
    professionalTitle: z.string().min(1, t("professional-title-required")),
    country: countrySchema(t)
      .nullable()
      .refine((val) => val !== null, { message: t("required-country-selection") }),
    languages: z.array(z.string()).nonempty(t("one-language-required")),
    splagenDirectory: z.boolean(),
  });

type ProfessionalInfoFormData = z.infer<ReturnType<typeof professionalInfoSchema>>;

const languages = ["english", "spanish", "portuguese", "other"];

export const ProfessionalInfoModal = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const { t } = useTranslation();
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    watch,
    setValue,
    setError,
  } = useForm<ProfessionalInfoFormData>({
    resolver: zodResolver(professionalInfoSchema(t)),
    defaultValues: {
      professionalTitle: "",
      country: undefined,
      languages: ["english"],
      splagenDirectory: false,
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

  const onSubmit = useCallback<SubmitHandler<ProfessionalInfoFormData>>(
    (data) => {
      const formattedData = {
        ...data,
        country: data.country.label,
      };
      console.log("Form Data:", formattedData);
      // Handle form submission logic here

      onClose();
    },
    [onClose],
  );

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
            <label htmlFor="professionalTitle">{t("professional-title")}*</label>
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
            <label>{t("country")}*</label>
            <Controller
              control={control}
              name="country"
              render={({ field }) => (
                <CountrySelector
                  value={field.value}
                  onChange={field.onChange}
                  placeholder={t("country-ellipsis")}
                />
              )}
            />
            <p className="error-message">{errors.country?.message ?? "\u00A0"}</p>
          </div>

          {/* Languages */}
          <div className="prof-info-field">
            <label htmlFor="languages">{t("preferred-language")}*</label>
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
            <label>{t("splagen-directory")}*</label>
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
