"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Radio } from "@tritonse/tse-constellation";
import dynamic from "next/dynamic";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";

import "./DirectoryPersonalInfoModal.css";
import { Modal } from "./Modal";
import { educationTypeOptions } from "./displayInfoConstants";

import { User, editDirectoryPersonalInfoRequest } from "@/api/users";
import { getCountryOptions } from "@/components/CountrySelector";
import { SuccessMessage } from "@/components/SuccessMessage";
import { UserContext } from "@/contexts/userContext";

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

const directoryInfoSchema = (t: (key: string) => string) =>
  z.object({
    degree: z.string().min(3, t("degree-3-characters")),
    institution: z.string().min(3, t("institution-3-characters")),
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

type DirectoryInfoFormData = z.infer<ReturnType<typeof directoryInfoSchema>>;

type DirectoryInfoModalProps = {
  isOpen: boolean;
  onClose: () => void;
  populationInfo: User | null;
};

export const DirectoryPersonalInfoModal: React.FC<DirectoryInfoModalProps> = ({
  isOpen,
  onClose,
  populationInfo,
}) => {
  const { t } = useTranslation();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
  } = useForm<DirectoryInfoFormData>({
    resolver: zodResolver(directoryInfoSchema(t)),
  });
  const { firebaseUser, reloadUser } = useContext(UserContext);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const onSubmit = useCallback<SubmitHandler<DirectoryInfoFormData>>(
    async (data) => {
      if (!firebaseUser) return;

      try {
        setErrorMessage("");
        setSuccessMessage("");

        const formattedData = {
          newDegree: data.degree,
          newEducationInstitution: data.institution,
          newClinicName: data.clinic,
          newClinicWebsiteUrl: data.website,
          newClinicAddress: data.addressLine,
          newClinicApartmentSuite: data.apartment,
          newClinicCity: data.city,
          newClinicState: data.state,
          newClinicZipPostCode: data.postcode,
          newClinicCountry: data.country.label,
        };

        const firebaseToken = await firebaseUser.getIdToken();
        const response = await editDirectoryPersonalInfoRequest(formattedData, firebaseToken);
        if (response.success) {
          setSuccessMessage("Directory personal information updated");
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

  useEffect(() => {
    if (isOpen && populationInfo) {
      reset({
        degree: populationInfo.education?.degree,
        institution: populationInfo.education?.institution,
        clinic: populationInfo.clinic?.name,
        website: populationInfo.clinic?.url,
        country: getCountryOptions().find(
          (option) => option.label === populationInfo.clinic?.location?.country,
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
      {" "}
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        onSave={handleSubmit(onSubmit)}
        title="Edit Personal Information"
        content={
          <form className="modal-form">
            <div className="dir-info-form-group">
              <label htmlFor="degree">
                {t("degree-certification")}
                <span className="red">*</span>
              </label>

              <Controller
                name="degree"
                control={control}
                render={({ field }) => (
                  <>
                    {educationTypeOptions.map(({ label, value }) => (
                      <Radio
                        key={label}
                        id={`education-${label}`}
                        label={label}
                        checked={field.value === value}
                        onChange={() => {
                          field.onChange(value);
                        }}
                      />
                    ))}
                  </>
                )}
              />
              <p className="error-message">{errors.degree?.message ?? "\u00A0"}</p>
            </div>

            <div className="dir-info-form-group">
              <label htmlFor="institution">
                {t("institution")}
                <span className="red">*</span>
              </label>
              <input
                className="dir-info-form-input"
                id="institution"
                {...register("institution")}
                placeholder={t("institution-placeholder")}
              />
              <p className="error-message">{errors.institution?.message ?? "\u00A0"}</p>
            </div>

            <div className="dir-info-form-group">
              <label htmlFor="clinic">
                Name of work clinic<span className="red">*</span>
              </label>
              <input
                className="dir-info-form-input"
                id="clinic"
                {...register("clinic")}
                placeholder="Enter name of clinic"
              />
              <p className="error-message">{errors.clinic?.message ?? "\u00A0"}</p>
            </div>

            <div className="dir-info-form-group">
              <label htmlFor="website">{t("clinic-website-link")}</label>
              <input
                className="dir-info-form-input"
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
                  className="dir-info-form-input"
                  id="addressLine"
                  {...register("addressLine")}
                  placeholder={t("address-line")}
                />
              </div>

              <div className="dir-info-form-group">
                <input
                  className="dir-info-form-input"
                  id="apartment"
                  {...register("apartment")}
                  placeholder={t("apartment-suite-etc")}
                />
              </div>

              <div className="city-state-postcode">
                <div className="dir-info-form-group">
                  <input
                    className="dir-info-form-input"
                    id="city"
                    {...register("city")}
                    placeholder={t("city")}
                  />
                </div>
                <div className="dir-info-form-group">
                  <input
                    className="dir-info-form-input"
                    id="state"
                    {...register("state")}
                    placeholder={t("state")}
                  />
                </div>
                <div className="dir-info-form-group">
                  <input
                    className="dir-info-form-input"
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
