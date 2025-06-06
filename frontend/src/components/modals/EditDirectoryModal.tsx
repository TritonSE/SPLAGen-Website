"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import React, { useCallback, useEffect, useMemo } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { isValidPhoneNumber } from "react-phone-number-input";
import { z } from "zod";

import styles from "./EditDirectoryModal.module.css";
import {
  ValidService,
  languages,
  serviceKeyToLabelMap,
  serviceLabelToKeyMap,
} from "./displayInfoConstants";

import ExitButton from "@/../public/icons/ExitButton.svg";
import "./ProfessionalInfoModal.css";
import { User, editDirectoryDisplayInfoRequest } from "@/api/users";
import { PhoneInput, PillButton } from "@/components";
import { Radio } from "@/components/Radio";

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  populationInfo: User;
};

const firebaseToken = "temp_firebase_token";

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
  const selectedLanguages = useMemo(() => watchedLanguages || ["english"], [watchedLanguages]);

  const watchedServiceKeys = watch("services");
  const selectedServiceLabels = useMemo(
    () =>
      watchedServiceKeys?.length
        ? watchedServiceKeys.map((key) => serviceKeyToLabelMap[key as ValidService])
        : ["Other"],
    [watchedServiceKeys],
  );

  const toggleSelection = useCallback(
    <T extends string>(
      fieldName: "languages" | "services",
      selected: T[],
      value: T,
      fallback: [T, ...T[]], // <- Non-empty tuple type here
      errorMessageKey: string,
    ) => {
      const updated = selected.includes(value)
        ? selected.filter((v) => v !== value)
        : [...selected, value];

      if (updated.length === 0) {
        setError(fieldName, {
          type: "manual",
          message: t(errorMessageKey),
        });
      }

      setValue(fieldName, updated.length ? (updated as [T, ...T[]]) : fallback);
    },
    [setValue, setError, t],
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

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

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

            <Controller
              name="workPhone"
              control={control}
              render={({ field }) => (
                <PhoneInput
                  placeholder={t("work-phone-placeholder")}
                  value={field.value?.replace(/\s+/g, "") || ""}
                  onChange={field.onChange}
                  defaultCountry="US"
                  international
                />
              )}
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
                    toggleSelection(
                      "services",
                      watchedServiceKeys || [],
                      key,
                      ["other"], // fallback is a non-empty tuple here
                      "one-service-required-default-other",
                    );
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
                    toggleSelection(
                      "languages",
                      selectedLanguages,
                      language,
                      ["english"], // fallback is a non-empty tuple here
                      "one-language-required-default-english",
                    );
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
                      setValue("requestOption", true);
                    }}
                  />
                  <Radio
                    id="geneticNo"
                    name="geneticTests"
                    value="no"
                    label="No"
                    checked={patientsCanRequestTests === "no"}
                    onChange={() => {
                      setValue("requestOption", false);
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
