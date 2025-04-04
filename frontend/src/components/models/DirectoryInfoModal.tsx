"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import dynamic from "next/dynamic";
import Image from "next/image";
import React, { useCallback } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";

import "./DirectoryInfoModal.css";
import ExitButton from "@/../public/icons/ExitButton.svg";

// Lazy load CountrySelector component to avoid hydration error
const CountrySelector = dynamic(() => import("@/components").then((mod) => mod.CountrySelector), {
  ssr: false,
});

// Define validation schema using Zod
const countrySchema = z.object({
  value: z.string().min(1, "Invalid country selection"),
  label: z.string().min(1),
});

const directoryInfoSchema = z.object({
  degree: z.string().min(3, "Degree must be at least 3 characters"),
  institution: z.string().min(3, "Institution must be at least 3 characters"),
  clinic: z.string().optional(),
  website: z.string().url("Invalid website URL").optional(),
  country: countrySchema
    .nullable()
    .refine((val) => val !== null, { message: "Country selection is required" }),
  addressLine: z.string().min(3, "Address must be at least 3 characters").optional(),
  apartment: z.string().optional(),
  city: z.string().min(2, "City must be at least 2 characters").optional(),
  state: z.string().min(2, "State must be at least 2 characters").optional(),
  postcode: z
    .string()
    .min(3, "Postcode must be at least 3 characters")
    .max(10, "Postcode must be at most 10 characters"),
});

type DirectoryInfoFormData = z.infer<typeof directoryInfoSchema>;

type DirectoryInfoModalProps = {
  isOpen: boolean;
  onClose: () => void;
};
const ExitButtonSrc: string = ExitButton as unknown as string;

export const DirectoryInfoModal: React.FC<DirectoryInfoModalProps> = ({ isOpen, onClose }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
  } = useForm<DirectoryInfoFormData>({
    resolver: zodResolver(directoryInfoSchema),
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
        <h2 className="dir-info-heading">Edit Directory Info</h2>
        <form onSubmit={handleFormSubmit} className="modal-form">
          <div className="dir-info-form-group">
            <label htmlFor="degree">Degree/Certification</label>
            <input id="degree" {...register("degree")} placeholder="e.g. Master's Degree" />
            <p className="error-message">{errors.degree?.message ?? "\u00A0"}</p>
          </div>

          <div className="dir-info-form-group">
            <label htmlFor="institution">Institution</label>
            <input id="institution" {...register("institution")} placeholder="e.g. UC San Diego" />
            <p className="error-message">{errors.institution?.message ?? "\u00A0"}</p>
          </div>

          <div className="dir-info-form-group">
            <label htmlFor="website">Clinic Website Link</label>
            <input id="website" {...register("website")} placeholder="https://example.com" />
            <p className="error-message">{errors.website?.message ?? "\u00A0"}</p>
          </div>

          <div className="directoryInfo-address">
            <div className="dir-info-form-group">
              <label>Address of Clinic</label>
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
            </div>

            <div className="dir-info-form-group">
              <input id="addressLine" {...register("addressLine")} placeholder="Address Line" />
            </div>

            <div className="dir-info-form-group">
              <input
                id="apartment"
                {...register("apartment")}
                placeholder="Apartment, suite, etc."
              />
            </div>

            <div className="city-state-postcode">
              <div className="dir-info-form-group">
                <input id="city" {...register("city")} placeholder="City" />
              </div>
              <div className="dir-info-form-group">
                <input id="state" {...register("state")} placeholder="State" />
              </div>
              <div className="dir-info-form-group">
                <input id="postcode" {...register("postcode")} placeholder="Postcode" />
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
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
