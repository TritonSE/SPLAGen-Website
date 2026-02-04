"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { isValidPhoneNumber } from "react-phone-number-input";
import { z } from "zod";

import "./EditBasicInfoModal.css";
import { PhoneInput } from "..";

import { Modal } from "./Modal";

import { EditBasicInfo, User, editBasicInfoRequest } from "@/api/users";
import { SuccessMessage } from "@/components/SuccessMessage";
import { UserContext } from "@/contexts/userContext";

type FormData = {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
};

const noSpecialChars = /^[a-zA-Z\s'-]+$/;

const schema = (t: (key: string) => string) =>
  z.object({
    firstName: z
      .string()
      .min(1, t("first-name-required"))
      .regex(noSpecialChars, t("invalid-first-name")),
    lastName: z
      .string()
      .min(1, t("last-name-required"))
      .regex(noSpecialChars, t("invalid-last-name")),
    email: z.string().min(1, t("email-required")).email(t("invalid-email")),
    phone: z
      .string()
      .optional()
      .refine((phoneNumber) => (phoneNumber ? isValidPhoneNumber(phoneNumber) : true), {
        message: t("invalid-phone-format"),
      }),
  });

export const EditBasicInfoModal = ({
  isOpen,
  onClose,
  populationInfo,
}: {
  isOpen: boolean;
  onClose: () => void;
  populationInfo: User | null;
}) => {
  const { t } = useTranslation();
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(schema(t)),
  });

  const { firebaseUser, reloadUser } = useContext(UserContext);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const onSubmit = useCallback<SubmitHandler<FormData>>(
    async (data) => {
      if (!firebaseUser) return;

      try {
        setError("");
        setSuccessMessage("");

        const firebaseToken = await firebaseUser.getIdToken();

        const newData: EditBasicInfo = {
          newFirstName: data.firstName,
          newLastName: data.lastName,
          newEmail: data.email,
          newPhone: data.phone,
        };

        const response = await editBasicInfoRequest(newData, firebaseToken);

        if (response.success) {
          setSuccessMessage("Basic information updated");
          await reloadUser();
          onClose();
        } else {
          setError(`Error updating info: ${response.error}`);
        }
      } catch (err) {
        setError(`Error updating info: ${String(err)}`);
      }
    },
    [onClose, firebaseUser, reloadUser],
  );

  useEffect(() => {
    if (isOpen && populationInfo) {
      reset({
        firstName: populationInfo?.personal.firstName ?? "",
        lastName: populationInfo?.personal.lastName ?? "",
        email: populationInfo?.personal.email ?? "",
        phone: populationInfo?.personal.phone ?? "",
      });
    }
  }, [isOpen, populationInfo, reset]);

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title={t("edit-basic-info")}
        content={
          <>
            <form className="modal-body">
              <div className="inputField">
                <label>
                  {t("first-name")}
                  <span className="red-text">*</span>
                </label>
                <input {...register("firstName")} placeholder={t("first-name")} />
                <p className="error">
                  {errors.firstName?.message && typeof errors.firstName.message === "string"
                    ? errors.firstName.message
                    : "\u00A0"}
                </p>
              </div>

              <div className="inputField">
                <label>
                  {t("last-name")}
                  <span className="red-text">*</span>
                </label>
                <input {...register("lastName")} placeholder={t("last-name")} />
                <p className="error">
                  {errors.lastName?.message && typeof errors.lastName.message === "string"
                    ? errors.lastName.message
                    : "\u00A0"}
                </p>
              </div>

              <div className="inputField">
                <label>
                  {t("email")}
                  <span className="red-text">*</span>
                </label>
                <input type="email" {...register("email")} placeholder={t("email")} />
                <p className="error">
                  {errors.email?.message && typeof errors.email.message === "string"
                    ? errors.email.message
                    : "\u00A0"}
                </p>
              </div>

              <div className="inputField">
                <label>
                  {t("phone")}
                  <span className="red-text">*</span>
                </label>

                <Controller
                  name="phone"
                  control={control}
                  render={({ field }) => (
                    <PhoneInput
                      placeholder="Enter your phone number"
                      value={field.value}
                      onChange={field.onChange}
                      defaultCountry="US"
                      international
                    />
                  )}
                />
                <p className="error">
                  {errors.phone?.message && typeof errors.phone.message === "string"
                    ? errors.phone.message
                    : "\u00A0"}
                </p>
              </div>

              {error && <div className="text-red-500">{error}</div>}
            </form>
          </>
        }
        onSave={handleSubmit(onSubmit)}
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
