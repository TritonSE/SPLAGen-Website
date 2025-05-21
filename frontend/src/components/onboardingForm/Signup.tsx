"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useStateMachine } from "little-state-machine";
import React, { useCallback } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";

import style from "./SignUp.module.css";

import { Button } from "@/components";
import { onboardingState } from "@/state/stateTypes";
import updateOnboardingForm from "@/state/updateOnboardingForm";

type SignUpProps = {
  onNext: (data: onboardingState["data"]) => void;
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
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    resolver: zodResolver(formSchema(t)),
    defaultValues: state.onboardingForm,
    mode: "onChange",
  });

  const onSubmit = useCallback(
    (data: onboardingState["data"]) => {
      actions.updateOnboardingForm(data);
      onNext(data);
    },
    [actions, onNext],
  );

  const handleFormSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      void handleSubmit(onSubmit)();
    },
    [handleSubmit, onSubmit],
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
            <p className={style.errorText}>{errors.email ? errors.email.message : "\u00A0"}</p>
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

          <div className={style.buttonContainer}>
            <Button type="submit" disabled={!isValid} label={t("continue")} />
          </div>
        </form>
      </div>
    </div>
  );
};
