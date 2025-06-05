"use client";
// TODO
// -
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import React, { useCallback, useEffect, useMemo } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { isValidPhoneNumber } from "react-phone-number-input";
import { z } from "zod";

import styles from "./EditDirectoryModal.module.css";

import ExitButton from "@/../public/icons/ExitButton.svg";
import "./ProfessionalInfoModal.css";
import { User, editDirectoryDisplayInfoRequest } from "@/api/users";
import { PillButton } from "@/components";
import { Radio } from "@/components/Radio";

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  populationInfo: User;
};

const firebaseToken = "temp_firebase_token";
const languages = ["english", "spanish", "portuguese", "other"];

type ValidService =
  | "other"
  | "pediatrics"
  | "cardiovascular"
  | "neurogenetics"
  | "rareDiseases"
  | "cancer"
  | "biochemical"
  | "prenatal"
  | "adult"
  | "psychiatric"
  | "reproductive"
  | "ophthalmic"
  | "research"
  | "pharmacogenomics"
  | "metabolic";

const serviceLabelToKeyMap: Record<string, ValidService> = {
  "Pediatric Genetics": "pediatrics",
  "Cardiovascular Genetics": "cardiovascular",
  Neurogenetics: "neurogenetics",
  "Rare Diseases": "rareDiseases",
  "Cancer Genetics": "cancer",
  "Biochemical Genetics": "biochemical",
  "Prenatal Genetics": "prenatal",
  "Adult Genetics": "adult",
  "Psychiatric Genetics": "psychiatric",
  "Assisted Reproductive Technologies and Preimplantation Genetic Testing": "reproductive",
  "Ophthalmic Genetics": "ophthalmic",
  Research: "research",
  Pharmacogenomics: "pharmacogenomics",
  "Metabolic Genetics": "metabolic",
  Other: "other",
} as const;

export const serviceKeyToLabelMap: Record<
  (typeof serviceLabelToKeyMap)[keyof typeof serviceLabelToKeyMap],
  keyof typeof serviceLabelToKeyMap
> = Object.entries(serviceLabelToKeyMap).reduce<Record<string, string>>((acc, [label, key]) => {
  acc[key] = label;
  return acc;
}, {});

const ExitButtonSrc: string = ExitButton as unknown as string;

export const DisplayInfoSchema = (t: (key: string) => string) =>
  z.object({
    workEmail: z.string().min(1, t("email-required")).email(t("invalid-email")),
    workPhone: z.string().refine(isValidPhoneNumber, {
      message: t("invalid-phone-format"),
    }),
    services: z.array(z.string()).nonempty(t("one-service-required")),
    languages: z.array(z.string()).nonempty(t("one-language-required")),
    license: z.string(),
    remoteOption: z.boolean(),
    requestOption: z.boolean(),
  });

type DisplayInfoModalType = z.infer<ReturnType<typeof DisplayInfoSchema>>;

export const EditDirectoryModal = ({ isOpen, onClose, populationInfo }: ModalProps) => {
  const { t } = useTranslation();
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    watch,
    reset,
    setValue,
    setError,
  } = useForm<DisplayInfoModalType>({
    resolver: zodResolver(DisplayInfoSchema(t)),
    defaultValues: {
      workEmail: populationInfo.display.workEmail,
      workPhone: populationInfo.display.workPhone,
      services: populationInfo.display.services,
      languages: populationInfo.display.languages,
      license: populationInfo.display.license?.[0] ?? "",
      remoteOption: populationInfo.display.options.remote,
      requestOption: populationInfo.display.options.openToRequests,
    },
  });

  // Keeps track of which languages are pressed
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

  const watchedServiceKeys = watch("services");
  const selectedServiceLabels = useMemo(
    () =>
      watchedServiceKeys?.length
        ? watchedServiceKeys.map((key) => serviceKeyToLabelMap[key as ValidService])
        : ["Other"],
    [watchedServiceKeys],
  );

  const toggleService = useCallback(
    (serviceLabel: string) => {
      const serviceKey = serviceLabelToKeyMap[serviceLabel];
      if (!serviceKey) return;

      const currentKeys = watchedServiceKeys || [];

      const updatedKeys = currentKeys.includes(serviceKey)
        ? currentKeys.filter((key) => key !== serviceKey)
        : [...currentKeys, serviceKey];

      if (updatedKeys.length === 0) {
        setError("services", {
          type: "manual",
          message: t("one-service-required-default-other"),
        });
      }

      setValue(
        "services",
        updatedKeys.length ? (updatedKeys as [ValidService, ...ValidService[]]) : ["other"],
      );
    },
    [watchedServiceKeys, setValue, setError, t],
  );

  const offersRemote = watch("remoteOption") ? "yes" : "no";
  const patientsCanRequestTests = watch("requestOption") ? "yes" : "no";

  // Sends form data to backend
  const onSubmit = useCallback<SubmitHandler<DisplayInfoModalType>>(
    async (data) => {
      // backend expects to have 'new' in the beginning of keys
      const formattedData = {
        newWorkEmail: data.workEmail,
        newWorkPhone: data.workPhone,
        newServices: data.services as ValidService[],
        newLanguages: data.languages as ("english" | "spanish" | "portuguese" | "other")[],
        newLicense: [data.license],
        newRemoteOption: data.remoteOption,
        newRequestOption: data.requestOption,
      };

      const response = await editDirectoryDisplayInfoRequest(formattedData, firebaseToken);
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
        workEmail: populationInfo.display.workEmail,
        workPhone: populationInfo.display.workPhone,
        services: populationInfo.display.services,
        languages: populationInfo.display.languages,
        license: populationInfo.display.license?.[0] ?? "",
        remoteOption: populationInfo.display.options.remote,
        requestOption: populationInfo.display.options.openToRequests,
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
    <div className={styles.modalOverlay}>
      <div className={styles.modalContainer}>
        <button className={styles.closeButton} onClick={onClose}>
          <Image src={ExitButtonSrc} alt="Exit" />
        </button>
        <h2 id="prof-info-h2">{t("edit-directory-display-info")}</h2>
        <form onSubmit={handleFormSubmit}>
          {/* Work Email */}
          <div className={styles.infoField}>
            <label htmlFor="workEmail">
              {t("work-email-of-contact")}
              <span className={styles.red}>*</span>
            </label>
            <input
              type="text"
              id="workEmail"
              placeholder={t("work-email-placeholder")}
              {...register("workEmail")}
            />
            <p className={styles.errorMessage}>{errors.workEmail?.message ?? "\u00A0"}</p>
          </div>

          {/* Work Phone */}
          <div className={styles.infoField}>
            <label htmlFor="workPhone">
              {t("work-phone-of-contact")}
              <span className={styles.red}>*</span>
            </label>
            {/* <PhoneInput /> */}
            <input
              type="text"
              id="workPhone"
              placeholder={t("work-phone-placeholder")}
              {...register("workPhone")}
            />
            <p className={styles.errorMessage}>{errors.workPhone?.message ?? "\u00A0"}</p>
          </div>

          {/* Services */}
          <div className={`${styles.infoField} mb-3`}>
            <label htmlFor="services">
              {t("genetic-services-offered")}
              <span className={styles.red}>*</span>
            </label>
            <div className={styles.PillList}>
              {Object.entries(serviceLabelToKeyMap).map(([label, key]) => (
                <PillButton
                  label={t(label)}
                  key={key}
                  isActive={selectedServiceLabels.includes(label)}
                  onClick={() => {
                    toggleService(key);
                  }}
                  className="mx-1 my-1"
                />
              ))}
            </div>
          </div>

          {/* Languages */}
          <div className={styles.infoField}>
            <label htmlFor="languages">
              {t("language-for-patient-care")}
              <span className={styles.red}>*</span>
            </label>
            <div>
              {languages.map((language) => (
                <PillButton
                  label={t(language)}
                  key={language}
                  isActive={selectedLanguages.includes(language)}
                  onClick={() => {
                    toggleLanguage(language);
                  }}
                  className="mx-1 my-1" // spacing
                />
              ))}
            </div>
            <p className={styles.errorMessage}>
              {errors.languages?.message && typeof errors.languages.message === "string"
                ? errors.languages.message
                : "\u00A0"}
            </p>
          </div>

          {/* License Number */}
          <div className={styles.infoField}>
            <label htmlFor="license">
              {t("license-number")}
              <span className={styles.red}>*</span>
            </label>
            <input type="text" id="license" placeholder={"12345678"} {...register("license")} />
            <p className={styles.errorMessage}>{errors.license?.message ?? "\u00A0"}</p>
          </div>

          {/* Remote Services */}
          <div className={`${styles.infoField} mb-3`}>
            <span> {t("offer-remote-services")} </span>

            <Controller
              name="remoteOption"
              control={control}
              render={() => (
                <div className="flex gap-2">
                  <Radio
                    id="remoteYes"
                    name="RemoteServices"
                    value="yes"
                    label="Yes"
                    checked={offersRemote === "yes"}
                    onChange={() => {
                      setValue("remoteOption", true);
                    }}
                  />
                  <Radio
                    id="remoteNo"
                    name="RemoteServices"
                    value="no"
                    label="No"
                    checked={offersRemote === "no"}
                    onChange={() => {
                      setValue("remoteOption", false);
                    }}
                  />
                </div>
              )}
            />
          </div>

          {/* Genetic Tests*/}
          <div className={`${styles.infoField} mb-2`}>
            <span> {t("request-genetic-tests")} </span>
            <Controller
              name="requestOption"
              control={control}
              render={() => (
                <div className="flex gap-2">
                  <Radio
                    id="geneticYes"
                    name="geneticTests"
                    value="yes"
                    label="Yes"
                    checked={patientsCanRequestTests === "yes"}
                    onChange={() => {
                      setValue("remoteOption", true);
                    }}
                  />
                  <Radio
                    id="geneticNo"
                    name="geneticTests"
                    value="no"
                    label="No"
                    checked={patientsCanRequestTests === "no"}
                    onChange={() => {
                      setValue("remoteOption", false);
                    }}
                  />
                </div>
              )}
            />
          </div>
          <button type="submit" id="prof-info-submit" className="button">
            {t("save")}
          </button>
        </form>
      </div>
    </div>
  );
};
