"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import dynamic from "next/dynamic";
import Image from "next/image";
import React, { useCallback } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";

import "./DirectoryInfoModal.css";
import ExitButton from "@/../public/icons/ExitButton.svg";

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
};
const ExitButtonSrc: string = ExitButton as unknown as string;

export const DirectoryInfoModal: React.FC<DirectoryInfoModalProps> = ({ isOpen, onClose }) => {
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

  const onSubmit = useCallback<SubmitHandler<DirectoryInfoFormData>>((data) => {
    const formattedData = {
      ...data,
      country: data.country.label,
    };

    try {
      //TODO Submit to backend
      console.log("data", formattedData);
    } catch (error) {
      console.error("Request failed:", error);
    }
  }, []);

  const handleFormSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault(); // Prevent default form behavior

      void handleSubmit(async (data) => {
        try {
          await onSubmit(data); // Ensure async handling
          reset();
          onClose();
        } catch (error) {
          console.error("Error submitting form:", error);
        }
      })();
    },
    [onSubmit, reset, onClose, handleSubmit],
  );

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="dir-info-modal-container">
        <button className="close-button" onClick={onClose}>
          <Image src={ExitButtonSrc} alt="Exit" />
        </button>
        <h2 className="dir-info-heading">{t("edit-directory-info")}</h2>
        <form onSubmit={handleFormSubmit} className="modal-form">
          <div className="dir-info-form-group">
            <label htmlFor="degree">{t("degree-certification")}</label>
            <input
              id="degree"
              {...register("degree")}
              placeholder={t("degree-certification-placeholder")}
            />
            <p className="error-message">{errors.degree?.message ?? "\u00A0"}</p>
          </div>

          <div className="dir-info-form-group">
            <label htmlFor="institution">{t("institution")}</label>
            <input
              id="institution"
              {...register("institution")}
              placeholder={t("institution-placeholder")}
            />
            <p className="error-message">{errors.institution?.message ?? "\u00A0"}</p>
          </div>

          <div className="dir-info-form-group">
            <label htmlFor="website">{t("clinic-website-link")}</label>
            <input
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
                id="addressLine"
                {...register("addressLine")}
                placeholder={t("address-line")}
              />
            </div>

            <div className="dir-info-form-group">
              <input
                id="apartment"
                {...register("apartment")}
                placeholder={t("apartment-suite-etc")}
              />
            </div>

            <div className="city-state-postcode">
              <div className="dir-info-form-group">
                <input id="city" {...register("city")} placeholder={t("city")} />
              </div>
              <div className="dir-info-form-group">
                <input id="state" {...register("state")} placeholder={t("state")} />
              </div>
              <div className="dir-info-form-group">
                <input id="postcode" {...register("postcode")} placeholder={t("postcode")} />
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

          <div>
            <button type="submit" className="save-button button">
              {t("save")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
