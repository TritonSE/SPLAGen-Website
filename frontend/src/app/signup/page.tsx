"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import React, { useCallback } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";

import style from "./SignUp.module.css";

const formSchema = (t: (key: string) => string) =>
  z.object({
    firstName: z.string().min(1, t("first-name-required")),
    lastName: z.string().min(1, t("last-name-required")),
    email: z.string().email(t("invalid-email")),
    password: z
      .string()
      .min(8, t("password-8-characters"))
      .regex(/[A-Z]/, t("password-1-uppercase"))
      .regex(/[a-z]/, t("password-1-lowercase"))
      .regex(/\d/, t("password-1-number"))
      .regex(/[!@#$%^&*(),.?":{}|<>]/, t("password-1-special")),
  });

type FormData = z.infer<ReturnType<typeof formSchema>>;

const SignUpPage = () => {
  const { t } = useTranslation();
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema(t)),
    mode: "onChange",
  });

  const onSubmit = useCallback((data: FormData) => {
    console.log("Signed Up!", data);
    alert("Signed Up!");
  }, []);

  const handleFormSubmit = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      void handleSubmit(onSubmit)();
    },
    [handleSubmit, onSubmit],
  );

  return (
    <div className={style.signup}>
      <div>
        <h1 className={` text-2xl font-bold text-left text-primary mb-2 ${style.signupTitle}`}>
          {t("get-started")}
        </h1>
        <p className={`text-left text-gray-600 mb-6  ${style.signupWelcome}`}>
          {t("welcome-to-splagen")}
        </p>
        <form onSubmit={handleFormSubmit} className="w-full">
          <div className={style.signupNames}>
            {/* First Name Input */}
            <div className="">
              <label className="block text-sm font-medium mb-1 text-black" htmlFor="firstName">
                {t("first-name")}
              </label>
              <input
                {...register("firstName")}
                className="p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 placeholder-disabled"
                placeholder={t("enter-first-name")}
                id="firstName"
              />
              <p className="text-red-500 text-xs mt-1">
                {errors.firstName ? errors.firstName.message : "\u00A0"}
              </p>
            </div>

            {/* Last Name Input */}
            <div className="">
              <label className="block text-sm font-medium mb-1 text-black" htmlFor="lastName">
                {t("last-name")}
              </label>
              <input
                {...register("lastName")}
                className="p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 placeholder-disabled"
                placeholder={t("enter-last-name")}
                id="lastName"
              />

              <p className="text-red-500 text-xs mt-1">
                {errors.lastName ? errors.lastName.message : "\u00A0"}
              </p>
            </div>
          </div>

          {/* Email Input */}
          <div>
            <label className="block text-sm font-medium mb-1 text-black" htmlFor="email">
              {t("enter-email")}
            </label>
            <input
              type="email"
              {...register("email")}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 placeholder-disabled"
              placeholder={t("enter-email")}
              autoComplete="email"
              id="email"
            />
            <p className="text-red-500 text-xs mt-1">
              {errors.email ? errors.email.message : "\u00A0"}
            </p>
          </div>

          {/* Create a Password */}
          <div className="mb-4 w-full">
            <label className="block text-sm font-medium mb-1 text-black" htmlFor="password">
              {t("create-password")}
            </label>
            <input
              type="password"
              {...register("password")}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 placeholder-disabled"
              placeholder={t("create-password")}
              id="password"
            />

            <p className="text-red-500 text-xs mt-1">
              {errors.password ? errors.password.message : "\u00A0"}
            </p>
          </div>

          <div className="flex justify-end w-full">
            <button
              type="submit"
              disabled={!isValid}
              className={`w-30 py-2 px-4 rounded-lg font-bold text-white mt-4 hover:bg-[#BCBCCF] ${
                isValid
                  ? "bg-primary hover:bg-primary-dark"
                  : "bg-disabled cursor-not-allowed pointer-events-none"
              }`}
            >
              {t("continue")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignUpPage;
