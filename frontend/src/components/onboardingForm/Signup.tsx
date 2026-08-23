"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useStateMachine } from "little-state-machine";
import Link from "next/link";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { isValidPhoneNumber } from "react-phone-number-input";
import { z } from "zod";

import style from "./SignUp.module.css";

import { checkEmailExists } from "@/api/users";
import { Button, PhoneInput } from "@/components";
import { onboardingState } from "@/state/stateTypes";
import updateOnboardingForm from "@/state/updateOnboardingForm";

// How long to wait after the user stops typing their email before checking
// whether an account with it already exists.
const EMAIL_CHECK_DEBOUNCE_MS = 500;

type SignUpProps = {
  onNext: (data: onboardingState["data"]) => void;
};

type BasicFormData = {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  password: string;
};

const formSchema = (t: (key: string) => string) =>
  z.object({
    firstName: z.string().min(1, t("first-name-required")).max(50, t("first-name-max-characters")),
    lastName: z.string().min(1, t("last-name-required")).max(50, t("last-name-max-characters")),
    email: z
      .string()
      .email(t("invalid-email"))
      .min(1, t("email-required"))
      .max(254, t("email-max-characters")),
    phone: z
      .string()
      .refine(isValidPhoneNumber, {
        message: t("invalid-phone-format"),
      })
      .optional(),
    password: z
      .string()
      .min(8, t("password-8-characters"))
      .max(128, t("password-max-characters"))
      .regex(/[A-Z]/, t("password-1-uppercase"))
      .regex(/[a-z]/, t("password-1-lowercase"))
      .regex(/\d/, t("password-1-number"))
      .regex(/[!@#$%^&*(),.?":{}|<>]/, t("password-1-special")),
  });

export const SignUp = ({ onNext }: SignUpProps) => {
  const { state, actions } = useStateMachine({ actions: { updateOnboardingForm } });
  const { t } = useTranslation();

  const {
    control,
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = useForm<BasicFormData>({
    resolver: zodResolver(formSchema(t)),
    defaultValues: state.onboardingForm,
    mode: "onChange",
  });

  // Tracks whether the currently-entered email address is already associated
  // with an existing account, so we can warn the user before they fill out
  // the rest of the signup flow.
  const [emailCheckStatus, setEmailCheckStatus] = useState<
    "idle" | "checking" | "available" | "exists" | "error"
  >("idle");
  const emailBeingChecked = useRef<string | null>(null);

  const watchedEmail = watch("email");
  const isEmailFormatValid = !errors.email && Boolean(watchedEmail);

  useEffect(() => {
    if (!isEmailFormatValid) {
      setEmailCheckStatus("idle");
      return;
    }

    setEmailCheckStatus("checking");
    const email = watchedEmail;

    const timeoutId = setTimeout(() => {
      emailBeingChecked.current = email;
      void checkEmailExists(email).then((result) => {
        // Ignore stale responses for an email the user has since changed.
        if (emailBeingChecked.current !== email) {
          return;
        }
        if (!result.success) {
          setEmailCheckStatus("error");
          return;
        }
        setEmailCheckStatus(result.data.exists ? "exists" : "available");
      });
    }, EMAIL_CHECK_DEBOUNCE_MS);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [watchedEmail, isEmailFormatValid]);

  const onSubmit = useCallback(
    (data: BasicFormData) => {
      actions.updateOnboardingForm({
        ...state.onboardingForm,
        ...data,
      });
      onNext({
        ...state.onboardingForm,
        ...data,
      });
    },
    [actions, onNext, state.onboardingForm],
  );

  const handleFormSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      // Don't let the user continue with an email that's already taken, or
      // while we're still waiting to find out.
      if (emailCheckStatus === "exists" || emailCheckStatus === "checking") {
        return;
      }
      void handleSubmit(onSubmit)();
    },
    [emailCheckStatus, handleSubmit, onSubmit],
  );

  return (
    <div className={style.signup}>
      <div className={style.signupContainer}>
        <h1 className={style.signupTitle}>{t("get-started")}</h1>
        <p className={style.signupWelcome}>{t("welcome-to-splagen")}</p>

        <form onSubmit={handleFormSubmit} className={style.signupForm}>
          <div className={style.signupNames}>
            <div className={style.inputGroup}>
              <label htmlFor="firstName" className={style.label}>
                {t("first-name")}
              </label>
              <input
                {...register("firstName")}
                id="firstName"
                className={style.input}
                placeholder={t("enter-first-name")}
              />
              <p className={style.errorText}>
                {errors.firstName ? errors.firstName.message : "\u00A0"}
              </p>
            </div>

            <div className={style.inputGroup}>
              <label htmlFor="lastName" className={style.label}>
                {t("last-name")}
              </label>
              <input
                {...register("lastName")}
                id="lastName"
                className={style.input}
                placeholder={t("enter-last-name")}
              />
              <p className={style.errorText}>
                {errors.lastName ? errors.lastName.message : "\u00A0"}
              </p>
            </div>
          </div>

          <div className={style.inputGroup}>
            <label htmlFor="email" className={style.label}>
              {t("enter-email")}
            </label>
            <input
              type="email"
              {...register("email")}
              id="email"
              className={style.input}
              placeholder={t("enter-email")}
              autoComplete="email"
            />
            <p className={style.errorText}>
              {errors.email
                ? errors.email.message
                : emailCheckStatus === "exists"
                  ? t("email-already-exists")
                  : ""}
            </p>
          </div>

          <div className={style.inputGroup}>
            <label htmlFor="email" className={style.label}>
              {t("phone-number")}
              <span className={style.optionalText}> {t("optional")}</span>
            </label>

            <Controller
              name="phone"
              control={control}
              render={({ field }) => (
                <PhoneInput
                  placeholder={t("enter-phone-number")}
                  value={field.value}
                  onChange={field.onChange}
                  defaultCountry="US"
                  international
                />
              )}
            />
            <p className={style.errorText}>{errors.phone ? errors.phone.message : "\u00A0"}</p>
          </div>

          <div className={style.inputGroup}>
            <label htmlFor="password" className={style.label}>
              {t("create-password")}
            </label>
            <input
              type="password"
              {...register("password")}
              id="password"
              className={style.input}
              placeholder={t("create-password")}
            />
            <p className={style.errorText}>
              {errors.password ? errors.password.message : "\u00A0"}
            </p>
          </div>
          <span>
            <span style={{ color: "black" }}> {t("have-account")} </span>
            <Link href="/login"> {t("log-in")} </Link>
          </span>

          <div className={style.buttonContainer}>
            <Button
              type="submit"
              disabled={
                !isValid || emailCheckStatus === "exists" || emailCheckStatus === "checking"
              }
              label={t("continue")}
            />
          </div>
        </form>
      </div>
    </div>
  );
};
