"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Radio } from "@tritonse/tse-constellation";
import React, { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { isValidPhoneNumber } from "react-phone-number-input";
import { z } from "zod";

import styles from "./EditDirectoryDisplayModal.module.css";
import { Modal } from "./Modal";
import {
  ValidService,
  languages,
  serviceKeyToLabelMap,
  serviceLabelToKeyMap,
} from "./displayInfoConstants";

import { User, editDirectoryDisplayInfoRequest } from "@/api/users";
import { PhoneInput, PillButton } from "@/components";
import { SuccessMessage } from "@/components/SuccessMessage";
import { UserContext } from "@/contexts/userContext";

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  populationInfo: User | null;
};

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
    canMakeAppointments: z.boolean(),
    authorizedForLanguages: z.union([z.boolean(), z.literal("unsure")]),
  });

type DisplayInfoModalType = z.infer<ReturnType<typeof DisplayInfoSchema>>;

export const EditDirectoryDisplayModal = ({ isOpen, onClose, populationInfo }: ModalProps) => {
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
      workEmail: populationInfo?.display?.workEmail,
      workPhone: populationInfo?.display?.workPhone,
      services: populationInfo?.display?.services,
      languages: populationInfo?.display?.languages,
      license: populationInfo?.display?.license?.[0] ?? "",
      remoteOption: populationInfo?.display?.options?.remote,
      requestOption: populationInfo?.display?.options?.openToRequests,
    },
  });
  const { firebaseUser, reloadUser } = useContext(UserContext);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

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

  // Sends form data to backend
  const onSubmit = useCallback<SubmitHandler<DisplayInfoModalType>>(
    async (data) => {
      if (!firebaseUser) return;

      try {
        setErrorMessage("");
        setSuccessMessage("");

        // backend expects to have 'new' in the beginning of keys
        const formattedData = {
          newWorkEmail: data.workEmail,
          newWorkPhone: data.workPhone,
          newServices: data.services as ValidService[],
          newLanguages: data.languages as ("english" | "spanish" | "portuguese" | "other")[],
          newLicense: [data.license],
          newRemoteOption: data.remoteOption,
          newRequestOption: data.requestOption,
          newAppointmentsOption: data.canMakeAppointments,
          newAuthorizedOption: data.authorizedForLanguages,
        };

        const firebaseToken = await firebaseUser.getIdToken();
        const response = await editDirectoryDisplayInfoRequest(formattedData, firebaseToken);
        if (response.success) {
          setSuccessMessage("Display information updated");
          reloadUser();
          onClose();
        } else {
          setErrorMessage(`Error updating info: ${response.error}`);
        }
      } catch (err) {
        setErrorMessage(`Error updating info: ${String(err)}`);
      }
    },
    [onClose, firebaseUser, reloadUser],
  );

  // Populates form inputs when modal is opened
  useEffect(() => {
    if (isOpen && populationInfo) {
      reset({
        workEmail: populationInfo.display?.workEmail,
        workPhone: populationInfo.display?.workPhone,
        services: populationInfo.display?.services,
        languages: populationInfo.display?.languages,
        license: populationInfo.display?.license?.[0] ?? "",
        remoteOption: populationInfo.display?.options?.remote,
        requestOption: populationInfo.display?.options?.openToRequests,
        canMakeAppointments: populationInfo.display?.options?.openToAppointments,
        authorizedForLanguages: populationInfo.display?.options?.authorizedCare,
      });
    }
  }, [isOpen, populationInfo, reset]);

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        onSave={handleSubmit(onSubmit)}
        title={t("edit-directory-display-info")}
        content={
          <form>
            {/* Work Email */}
            <div className={styles.infoField}>
              <label htmlFor="workEmail">
                {t("work-email-of-contact")}
                <span className={styles.red}>*</span>
              </label>
              <input
                className={styles.infoFieldBox}
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

            {/* Authorized to provide care */}
            <div className={`${styles.infoField} mb-3`}>
              <span>
                Based on your state health institutions and policies, are you authorized to provide
                care in the languages mentioned above?
              </span>

              <Controller
                name="authorizedForLanguages"
                control={control}
                render={({ field }) => (
                  <div className="flex gap-2">
                    <Radio
                      id="authorizedForLanguagesYes"
                      label="Yes"
                      checked={field.value === true}
                      onChange={() => {
                        field.onChange(true);
                      }}
                    />
                    <Radio
                      id="authorizedForLanguagesNo"
                      label="No"
                      checked={field.value === false}
                      onChange={() => {
                        field.onChange(false);
                      }}
                    />
                    <Radio
                      id="authorized-unsure"
                      label="I'm not sure"
                      checked={field.value === "unsure"}
                      onChange={() => {
                        field.onChange("unsure");
                      }}
                    />
                  </div>
                )}
              />
            </div>

            {/* License Number */}
            <div className={styles.infoField}>
              <label htmlFor="license">{t("license-number")}</label>
              <input
                className={styles.infoFieldBox}
                type="text"
                id="license"
                placeholder={"12345678"}
                {...register("license")}
              />
              <p className={styles.errorMessage}>{errors.license?.message ?? "\u00A0"}</p>
            </div>

            {/* Remote Services */}
            <div className={`${styles.infoField} mb-3`}>
              <span>Do you offer remote medical services (e.g. telehealth)?</span>

              <Controller
                name="remoteOption"
                control={control}
                render={({ field }) => (
                  <div className="flex gap-2">
                    <Radio
                      id="remoteYes"
                      name="RemoteServices"
                      label="Yes"
                      checked={field.value}
                      onChange={() => {
                        field.onChange(true);
                      }}
                    />
                    <Radio
                      id="remoteNo"
                      name="RemoteServices"
                      label="No"
                      checked={!field.value}
                      onChange={() => {
                        field.onChange(false);
                      }}
                    />
                  </div>
                )}
              />
            </div>

            {/* Genetic Tests*/}
            <div className={`${styles.infoField} mb-2`}>
              <span>Can patients request genetic tests through your services?</span>
              <Controller
                name="requestOption"
                control={control}
                render={({ field }) => (
                  <div className="flex gap-2">
                    <Radio
                      id="geneticYes"
                      name="geneticTests"
                      label="Yes"
                      checked={field.value}
                      onChange={() => {
                        field.onChange(true);
                      }}
                    />
                    <Radio
                      id="geneticNo"
                      name="geneticTests"
                      label="No"
                      checked={!field.value}
                      onChange={() => {
                        field.onChange(false);
                      }}
                    />
                  </div>
                )}
              />
            </div>

            {/* Appointmenets*/}
            <div className={`${styles.infoField} mb-2`}>
              <span>Can patients make appointments for your services?</span>
              <Controller
                name="canMakeAppointments"
                control={control}
                render={({ field }) => (
                  <div className="flex gap-2">
                    <Radio
                      id="appointments-yes"
                      label="Yes"
                      checked={field.value}
                      onChange={() => {
                        field.onChange(true);
                      }}
                    />
                    <Radio
                      id="appointments-no"
                      label="No"
                      checked={!field.value}
                      onChange={() => {
                        field.onChange(false);
                      }}
                    />
                  </div>
                )}
              />
            </div>

            {errorMessage && <div className="text-red-500">{errorMessage}</div>}
          </form>
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
