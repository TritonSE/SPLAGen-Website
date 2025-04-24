"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import React, { useCallback, useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { isValidPhoneNumber } from "react-phone-number-input";
import { z } from "zod";

import ExitButton from "@/../public/icons/ExitButton.svg";
import "./EditBasicInfoModal.css";
import { User, editBasicInfoRequest, getWhoAmI } from "@/api/users";
const ExitButtonSrc: string = ExitButton as unknown as string;

type FormData = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
};

const schema = (t: (key: string) => string) =>
  z.object({
    firstName: z.string().min(1, t("first-name-required")),
    lastName: z.string().min(1, t("last-name-required")),
    email: z.string().min(1, t("email-required")).email(t("invalid-email")),
    phone: z.string().refine(isValidPhoneNumber, {
      message: t("invalid-phone-format"),
    }),
  });

export const EditBasicInfoModal = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const { t } = useTranslation();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(schema(t)),
  });

  // const { firebaseUser } = useContext(UserContext);
  // const { user, reloadUser } = useContext(UserContext);

  const [jsonUserData, setJsonUserData] = useState<User | null>(null);

  const fetchUserData = useCallback(async () => {
    const res = await getWhoAmI("temp_firebase_token");
    if (res.success) {
      setJsonUserData(res.data);
    }
  }, []);

  const onSubmit = useCallback<SubmitHandler<FormData>>(
    async (data) => {
      // const firebaseToken = await firebaseUser?.getIdToken();
      // if (!firebaseToken || editingItemId === null) {
      //  //TODO Error handling?
      //   return;
      // }

      const response = await editBasicInfoRequest(data, "firebaseToken");

      if (response.success) {
        onClose();
      }
      //TODO: else error handling? PAP's notifications?
    },
    [onClose],
  );

  //TODO: populate the form with backend data
  // useEffect(() => {
  //   // Simulating an API call
  //   setTimeout(() => {
  //     const fetchedData = {
  //       name: "Jane Doe",
  //       email: "janedoe@example.com",
  //     };
  //     reset(fetchedData); // Populates the form with fetched data
  //   }, 1000);
  // }, [reset]);

  // populate form with user context data
  useEffect(() => {
    fetchUserData().catch((err: unknown) => {
      console.error("Error in fetchData:", err);
    });

    if (jsonUserData) {
      reset({
        firstName: jsonUserData?.personal.firstName ?? "",
        lastName: jsonUserData?.personal.lastName ?? "",
        email: jsonUserData?.personal.email ?? "",
        phone: jsonUserData?.personal.phone ?? "",
      });
    }
  }, [jsonUserData, fetchUserData, reset]);

  const handleFormSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      void handleSubmit(onSubmit)();
    },
    [handleSubmit, onSubmit],
  );

  return isOpen ? (
    <div className="modal-overlay">
      <div className="modal-container">
        <button className="close-button" onClick={onClose}>
          <Image src={ExitButtonSrc} alt="Exit" />
        </button>
        <div className="modal-header">
          <h2> {t("edit-basic-info")} </h2>
        </div>
        <form onSubmit={handleFormSubmit} className="modal-body">
          <div className="inputField">
            <label>{t("first-name")}*</label>
            <input {...register("firstName")} placeholder={t("first-name")} />
            <p className="error">
              {errors.firstName?.message && typeof errors.firstName.message === "string"
                ? errors.firstName.message
                : "\u00A0"}
            </p>
          </div>

          <div className="inputField">
            <label>{t("last-name")}*</label>
            <input {...register("lastName")} placeholder={t("last-name")} />
            <p className="error">
              {errors.lastName?.message && typeof errors.lastName.message === "string"
                ? errors.lastName.message
                : "\u00A0"}
            </p>
          </div>

          <div className="inputField">
            <label>{t("email")}*</label>
            <input type="email" {...register("email")} placeholder={t("email")} />
            <p className="error">
              {errors.email?.message && typeof errors.email.message === "string"
                ? errors.email.message
                : "\u00A0"}
            </p>
          </div>

          <div className="inputField">
            <label>{t("phone")}*</label>
            <input type="tel" {...register("phone")} placeholder="+1 (123) 456 7890" />
            <p className="error">
              {errors.phone?.message && typeof errors.phone.message === "string"
                ? errors.phone.message
                : "\u00A0"}
            </p>
          </div>

          <div className="modal-footer">
            <button type="submit">
              <span>{t("save")}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  ) : null;
};
