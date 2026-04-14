"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Radio } from "@tritonse/tse-constellation";
import dynamic from "next/dynamic";
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
import { getCountryOptions } from "@/components/CountrySelector";
import { SuccessMessage } from "@/components/SuccessMessage";
import { UserContext } from "@/contexts/userContext";

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  populationInfo: User | null;
};

// Lazy load CountrySelector component to avoid hydration error
const CountrySelector = dynamic(() => import("@/components").then((mod) => mod.CountrySelector), {
  ssr: false,
});

// Define validation schema using Zod
const countrySchema = (t: (key: string) => string) =>
  z.object({
    value: z.string().min(1, t("invalid-country-selection")),
    label: z.string().min(1),
  });

export const DisplayInfoSchema = (t: (key: string) => string) =>
  z.object({
    workEmail: z.string().min(1, t("email-required")).email(t("invalid-email")),
    workPhone: z.string().refine(isValidPhoneNumber, {
      message: t("invalid-phone-format"),
    }),
    services: z.array(z.string()).nonempty(t("one-service-required")),
    languages: z.array(z.string()).nonempty(t("one-language-required")),
    remoteOption: z.boolean(),
    requestOption: z.boolean(),
    canMakeAppointments: z.boolean(),
    authorizedForLanguages: z.union([z.boolean(), z.literal("unsure")]),
    clinic: z.string().optional(),
    website: z.string().url(t("invalid-website-url")).optional(),
    country: countrySchema(t).refine((val) => val !== null, {
      message: t("required-country-selection"),
    }),
    addressLine: z.string().min(3, t("address-3-characters")).optional(),
    apartment: z.string().optional(),
    city: z.string().min(2, t("city-2-characters")).optional(),
    state: z.string().min(2, t("state-2-characters")).optional(),
    postcode: z
      .string()
      .min(3, t("postcode-3-characters"))
      .max(10, t("postcode-10-max-characters")),
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
      remoteOption: populationInfo?.display?.options?.remote,
      requestOption: populationInfo?.display?.options?.openToRequests,
    },
  });
  const { firebaseUser, reloadUser } = useContext(UserContext);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);

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

      setErrorMessage("");
      setSuccessMessage("");
      setLoading(true);

      try {
        // backend expects to have 'new' in the beginning of keys
        const formattedData = {
          newWorkEmail: data.workEmail,
          newWorkPhone: data.workPhone,
          newServices: data.services as ValidService[],
          newLanguages: data.languages as ("english" | "spanish" | "portuguese")[],
          newRemoteOption: data.remoteOption,
          newRequestOption: data.requestOption,
          newAppointmentsOption: data.canMakeAppointments,
          newAuthorizedOption: data.authorizedForLanguages,
          newClinicName: data.clinic,
          newClinicWebsiteUrl: data.website,
          newClinicAddress: data.addressLine,
          newClinicApartmentSuite: data.apartment,
          newClinicCity: data.city,
          newClinicState: data.state,
          newClinicZipPostCode: data.postcode,
          newClinicCountry: data.country.value,
        };

        const firebaseToken = await firebaseUser.getIdToken();
        const response = await editDirectoryDisplayInfoRequest(formattedData, firebaseToken);
        if (response.success) {
          setSuccessMessage(t("display-information-updated"));
          await reloadUser();
          onClose();
        } else {
          setErrorMessage(`${t("error-updating-info")}: ${response.error}`);
        }
      } catch (err) {
        setErrorMessage(`${t("error-updating-info")}: ${String(err)}`);
      } finally {
        setLoading(false);
      }
    },
    [onClose, firebaseUser, reloadUser, t],
  );

  // Populates form inputs when modal is opened
  useEffect(() => {
    if (isOpen && populationInfo) {
      reset({
        workEmail: populationInfo.display?.workEmail,
        workPhone: populationInfo.display?.workPhone,
        services: populationInfo.display?.services,
        languages: populationInfo.display?.languages,
        remoteOption: populationInfo.display?.options?.remote,
        requestOption: populationInfo.display?.options?.openToRequests,
        canMakeAppointments: populationInfo.display?.options?.openToAppointments,
        authorizedForLanguages: populationInfo.display?.options?.authorizedCare,
        clinic: populationInfo.clinic?.name,
        website: populationInfo.clinic?.url,
        country: getCountryOptions().find(
          (option) => option.value === populationInfo.clinic?.location?.country,
        ),
        addressLine: populationInfo.clinic?.location?.address,
        apartment: populationInfo.clinic?.location?.suite,
        city: populationInfo.clinic?.location?.city,
        state: populationInfo.clinic?.location?.state,
        postcode: populationInfo.clinic?.location?.zipPostCode,
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
        loading={loading}
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
                        "one-service-required",
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
              <span>{t("authorized-in-languages-question")}</span>

              <Controller
                name="authorizedForLanguages"
                control={control}
                render={({ field }) => (
                  <div className="flex gap-2">
                    <Radio
                      id="authorizedForLanguagesYes"
                      label={t("yes")}
                      checked={field.value === true}
                      onChange={() => {
                        field.onChange(true);
                      }}
                    />
                    <Radio
                      id="authorizedForLanguagesNo"
                      label={t("no")}
                      checked={field.value === false}
                      onChange={() => {
                        field.onChange(false);
                      }}
                    />
                    <Radio
                      id="authorized-unsure"
                      label={t("im-not-sure")}
                      checked={field.value === "unsure"}
                      onChange={() => {
                        field.onChange("unsure");
                      }}
                    />
                  </div>
                )}
              />
            </div>

            {/* Remote Services */}
            <div className={`${styles.infoField} mb-3`}>
              <span>{t("do-you-offer-telehealth")}</span>

              <Controller
                name="remoteOption"
                control={control}
                render={({ field }) => (
                  <div className="flex gap-2">
                    <Radio
                      id="remoteYes"
                      name="RemoteServices"
                      label={t("yes")}
                      checked={field.value}
                      onChange={() => {
                        field.onChange(true);
                      }}
                    />
                    <Radio
                      id="remoteNo"
                      name="RemoteServices"
                      label={t("no")}
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
              <span>{t("can-patients-request-tests")}</span>
              <Controller
                name="requestOption"
                control={control}
                render={({ field }) => (
                  <div className="flex gap-2">
                    <Radio
                      id="geneticYes"
                      name="geneticTests"
                      label={t("yes")}
                      checked={field.value}
                      onChange={() => {
                        field.onChange(true);
                      }}
                    />
                    <Radio
                      id="geneticNo"
                      name="geneticTests"
                      label={t("no")}
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
              <span>{t("can-patients-make-appointments")}</span>
              <Controller
                name="canMakeAppointments"
                control={control}
                render={({ field }) => (
                  <div className="flex gap-2">
                    <Radio
                      id="appointments-yes"
                      label={t("yes")}
                      checked={field.value}
                      onChange={() => {
                        field.onChange(true);
                      }}
                    />
                    <Radio
                      id="appointments-no"
                      label={t("no")}
                      checked={!field.value}
                      onChange={() => {
                        field.onChange(false);
                      }}
                    />
                  </div>
                )}
              />
            </div>

            <div className={`${styles.infoField} mb-3`}>
              <label htmlFor="clinic">
                {t("name-of-work-clinic-label")}
                <span className="red">*</span>
              </label>
              <input
                className={styles.infoFieldBox}
                id="clinic"
                {...register("clinic")}
                placeholder={t("enter-name-of-clinic")}
              />
              <p className="error-message">{errors.clinic?.message ?? "\u00A0"}</p>
            </div>

            <div className={`${styles.infoField} mb-3`}>
              <label htmlFor="website">{t("clinic-website-link")}</label>
              <input
                className={styles.infoFieldBox}
                id="website"
                {...register("website")}
                placeholder={t("clinic-website-link-placeholder")}
              />
              <p className="error-message">{errors.website?.message ?? "\u00A0"}</p>
            </div>

            <div className="directoryInfo-address">
              <div className="dir-info-form-group">
                <label>{t("clinic-address")}</label>
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
              </div>

              <div className="dir-info-form-group">
                <input
                  className={styles.infoFieldBox}
                  id="addressLine"
                  {...register("addressLine")}
                  placeholder={t("address-line")}
                />
              </div>

              <div className="dir-info-form-group">
                <input
                  className={styles.infoFieldBox}
                  id="apartment"
                  {...register("apartment")}
                  placeholder={t("apartment-suite-etc")}
                />
              </div>

              <div className="city-state-postcode">
                <div className="dir-info-form-group">
                  <input
                    className={styles.infoFieldBox}
                    id="city"
                    {...register("city")}
                    placeholder={t("city")}
                  />
                </div>
                <div className="dir-info-form-group">
                  <input
                    className={styles.infoFieldBox}
                    id="state"
                    {...register("state")}
                    placeholder={t("state")}
                  />
                </div>
                <div className="dir-info-form-group">
                  <input
                    className={styles.infoFieldBox}
                    id="postcode"
                    {...register("postcode")}
                    placeholder={t("postcode")}
                  />
                </div>
              </div>
            </div>
            {/* Only Display 1 error message at a time for address  */}
            <div className="error-message">
              {errors.country?.message ||
              errors.addressLine?.message ||
              errors.apartment?.message ||
              errors.city?.message ||
              errors.state?.message ||
              errors.postcode?.message ? (
                <p>
                  {errors.country?.message ??
                    errors.addressLine?.message ??
                    errors.apartment?.message ??
                    errors.city?.message ??
                    errors.state?.message ??
                    errors.postcode?.message}
                </p>
              ) : (
                "\u00A0"
              )}
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
