"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import dynamic from "next/dynamic";
import Image from "next/image";
import React, { useCallback } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";

import ExitButton from "@/../public/Icons/ExitButton.svg";
import "./ProfessionalInfoModal.css";
import { PillButton } from "@/components";

// Lazy load CountrySelector component to avoid hydration error
const CountrySelector = dynamic(() => import("@/components").then((mod) => mod.CountrySelector), {
  ssr: false,
});

const ExitButtonSrc: string = ExitButton as unknown as string;

const countrySchema = z.object({
  value: z.string().min(1, "Invalid country selection"),
  label: z.string().min(1),
});

const professionalInfoSchema = z.object({
  professionalTitle: z.string().min(1, "Professional Title is required"),
  country: countrySchema
    .nullable()
    .refine((val) => val !== null, { message: "Country selection is required" }),
  languages: z.array(z.string()).nonempty("At least one language is required"),
  splagenDirectory: z.boolean(),
});

type ProfessionalInfoFormData = z.infer<typeof professionalInfoSchema>;

const languages = ["English", "Spanish", "Portuguese", "Other"];

export const ProfessionalInfoModal = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    watch,
    setValue,
    setError,
  } = useForm<ProfessionalInfoFormData>({
    resolver: zodResolver(professionalInfoSchema),
    defaultValues: {
      professionalTitle: "",
      country: undefined,
      languages: ["English"],
      splagenDirectory: false,
    },
  });

  const watchedLanguages = watch("languages");
  const selectedLanguages = React.useMemo(
    () => watchedLanguages || ["English"],
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
          message: "At least one language is required, defaulting to English",
        });
      }

      setValue(
        "languages",
        updatedLanguages.length ? (updatedLanguages as [string, ...string[]]) : ["English"],
      );
    },
    [selectedLanguages, setValue, setError],
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
        <h2 id="prof-info-h2">Edit Professional Info</h2>
        <form className="prof-info-form" onSubmit={handleFormSubmit}>
          {/* Professional Title */}
          <div className="prof-info-field">
            <label htmlFor="professionalTitle">Professional Title*</label>
            <input
              type="text"
              id="professionalTitle"
              placeholder="e.g. Genetic Counselor"
              {...register("professionalTitle")}
            />
            <p className="error-message">{errors.professionalTitle?.message ?? "\u00A0"}</p>
          </div>

          {/* Country */}
          <div className="prof-info-field">
            <label>Country*</label>
            <Controller
              control={control}
              name="country"
              render={({ field }) => (
                <CountrySelector
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="Country..."
                />
              )}
            />
            <p className="error-message">{errors.country?.message ?? "\u00A0"}</p>
          </div>

          {/* Languages */}
          <div className="prof-info-field">
            <label htmlFor="languages">Prefered Languages*</label>
            <div className="language-options">
              {languages.map((language) => (
                <PillButton
                  label={language}
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
            <label>SPLAGen Directory*</label>
            <p>{watch("splagenDirectory") ? "Yes" : "No"}</p>
          </div>
          <button type="submit" id="prof-info-submit" className="button">
            Save
          </button>
        </form>
      </div>
    </div>
  );
};
