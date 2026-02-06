"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import dynamic from "next/dynamic";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import countryList from "react-select-country-list";
import { z } from "zod";

import "./ProfessionalInfoModal.css";

import { Modal } from "./Modal";

import { User, editProfessionalInfoRequest, professionalTitleOptions } from "@/api/users";
import { PillButton, ProfessionalTitleSelector } from "@/components";
import { SuccessMessage } from "@/components/SuccessMessage";
import { getCurrentLanguage } from "@/components/languageSwitcher";
import { UserContext } from "@/contexts/userContext";

type professionalInfoProps = {
  isOpen: boolean;
  onClose: () => void;
  populationInfo: User | null;
};
const CountryOptions = countryList().getData();

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

const countrySchema = (t: (key: string) => string) =>
  z.object({
    value: z.string().min(1, t("invalid-country-selection")),
    label: z.string().min(1),
  });

export const professionalInfoSchema = (t: (key: string) => string) =>
  z.object({
    professionalTitle: z.string().min(1, t("professional-title-required")),
    professionalTitleOther: z.string(),
    country: countrySchema(t).optional(),
    language: z.enum(["english", "spanish", "portuguese", "other"], {
      errorMap: () => ({ message: t("one-language-required") }),
    }),
    splagenDirectory: z.boolean(),
  });

type ProfessionalInfoFormData = z.infer<ReturnType<typeof professionalInfoSchema>>;

export const ProfessionalInfoModal = ({
  isOpen,
  onClose,
  populationInfo,
}: professionalInfoProps) => {
  const isOtherProfessionalTitleOption = (value: string | undefined) =>
    value &&
    (value === "other" || !professionalTitleOptions.find((option) => option.value === value));

  const { t } = useTranslation();
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    watch,
    reset,
  } = useForm<ProfessionalInfoFormData>({
    resolver: zodResolver(professionalInfoSchema(t)),
    defaultValues: {
      professionalTitle: isOtherProfessionalTitleOption(populationInfo?.professional?.title)
        ? "other"
        : populationInfo?.professional?.title,
      professionalTitleOther: isOtherProfessionalTitleOption(populationInfo?.professional?.title)
        ? populationInfo?.professional?.title
        : "",
      country: getCountryOption(populationInfo?.professional?.country),
      language:
        populationInfo?.professional?.prefLanguage ?? getCurrentLanguage()?.dbValue ?? "english",
      splagenDirectory: populationInfo?.account.inDirectory === true,
    },
  });
  const { firebaseUser, reloadUser } = useContext(UserContext);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const watchedProfessionalTitle = watch("professionalTitle");

  // Sends form data to backend
  const onSubmit = useCallback<SubmitHandler<ProfessionalInfoFormData>>(
    async (data) => {
      if (!firebaseUser) return;

      setErrorMessage("");
      setSuccessMessage("");
      setLoading(true);

      try {
        // backend expects to have 'new' in the beginning of keys
        const formattedData = {
          newTitle:
            data.professionalTitle === "other"
              ? data.professionalTitleOther
              : data.professionalTitle,
          newPrefLanguage: data.language,
          newOtherPrefLanguage: "",
          newCountry: data.country?.label ?? "",
        };

        const firebaseToken = await firebaseUser.getIdToken();
        const response = await editProfessionalInfoRequest(formattedData, firebaseToken);
        if (response.success) {
          setSuccessMessage("Professional information updated");
          await reloadUser();
          onClose();
        } else {
          setErrorMessage(`Error updating info: ${response.error}`);
        }
      } catch (err) {
        setErrorMessage(`Error updating info: ${String(err)}`);
      } finally {
        setLoading(false);
      }
    },
    [onClose, firebaseUser, setErrorMessage, setSuccessMessage, reloadUser],
  );

  // Populates form inputs when modal is opened
  useEffect(() => {
    if (isOpen && populationInfo) {
      reset({
        professionalTitle: isOtherProfessionalTitleOption(populationInfo.professional?.title)
          ? "other"
          : populationInfo.professional?.title,
        professionalTitleOther: isOtherProfessionalTitleOption(populationInfo.professional?.title)
          ? populationInfo.professional?.title
          : "",
        country: getCountryOption(populationInfo.professional?.country),
        language:
          populationInfo.professional?.prefLanguage ?? getCurrentLanguage()?.dbValue ?? "english",
        splagenDirectory: populationInfo.account.inDirectory === true,
      });
    }
  }, [isOpen, populationInfo, reset]);

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title={t("edit-professional-info")}
        onSave={handleSubmit(onSubmit)}
        loading={loading}
        content={
          <>
            <form className="prof-info-form">
              {/* Professional Title */}
              <div className="prof-info-field">
                <label htmlFor="professionalTitle">
                  {t("professional-title")}
                  <span className="red-text">*</span>
                </label>

                <Controller
                  name="professionalTitle"
                  control={control}
                  render={({ field }) => (
                    <ProfessionalTitleSelector
                      value={
                        professionalTitleOptions.find((option) => option.value === field.value) ??
                        null
                      }
                      onChange={(newValue) => {
                        field.onChange(newValue?.value);
                      }}
                    />
                  )}
                />
                <p className="error-message">{errors.professionalTitle?.message ?? "\u00A0"}</p>
              </div>

              {/* Professional title other - please specify */}

              {isOtherProfessionalTitleOption(watchedProfessionalTitle) && (
                <div className="prof-info-field">
                  <label htmlFor="professionalTitleOther">Please Specify</label>
                  <Controller
                    name="professionalTitleOther"
                    control={control}
                    render={() => (
                      <input {...register("professionalTitleOther")} placeholder="Please specify" />
                    )}
                  />

                  <p className="error-message">
                    {errors.professionalTitleOther?.message ?? "\u00A0"}
                  </p>
                </div>
              )}

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

              {/* Language */}
              <div className="prof-info-field">
                <label htmlFor="language">
                  {t("preferred-language")}
                  <span className="red-text">*</span>
                </label>
                <Controller
                  name="language"
                  control={control}
                  render={({ field }) => (
                    <div className="language-options">
                      {languages.map((language) => (
                        <PillButton
                          label={t(language)}
                          key={language}
                          isActive={field.value === language}
                          onClick={() => {
                            field.onChange(language);
                          }}
                        />
                      ))}
                    </div>
                  )}
                />
                <p className="error-message">
                  {errors.language?.message && typeof errors.language.message === "string"
                    ? errors.language.message
                    : "\u00A0"}
                </p>
              </div>

              {errorMessage && <div className="text-red-500">{errorMessage}</div>}
            </form>
          </>
        }
      />
      <SuccessMessage
        message={successMessage}
        onDismiss={() => {
          setSuccessMessage("");
        }}
      />
    </>
  );
};
