"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";

import styles from "./login.module.css";

import { Checkmark } from "@/components";

// Define the schema for form validation using Zod
const schema = z.object({
  email: z.string().email(),
  password: z.string(),
  rememberMe: z.boolean().optional(),
});

// Infer the TypeScript type from the Zod schema
type FormFields = z.infer<typeof schema>;

// Initialize react-hook-form
const Login: React.FC = () => {
  const [rememberMe, setRememberMe] = useState(false);
  const { t } = useTranslation();

  const {
    register,
    handleSubmit,
    setError,
    setValue,
    formState: { errors, isSubmitting, isValid },
  } = useForm<FormFields>({
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
    resolver: zodResolver(schema),
    mode: "onChange",
  });

  // Effect to check for remembered email on component mount aka refresh
  useEffect(() => {
    const rememberedEmail = localStorage.getItem("rememberedEmail");
    const rememberedRememberMe = localStorage.getItem("rememberMe") === "true"; // remembers whether checkmark was on.
    if (rememberedEmail) {
      setValue("email", rememberedEmail);
    }
    if (rememberedRememberMe) {
      setRememberMe(true);
      setValue("rememberMe", true);
    }
  }, [setValue, setRememberMe]);

  // Form submission handler
  const onSubmit: SubmitHandler<FormFields> = useCallback(
    async (data) => {
      try {
        await new Promise((resolve) => {
          setTimeout(resolve, 1000);
        });

        // Simulate API call with a 1-second delay...
        // Note how only email is saved...not the password.
        if (data.rememberMe) {
          localStorage.setItem("rememberedEmail", data.email);
          localStorage.setItem("rememberMe", "true");
        } else {
          localStorage.removeItem("rememberedEmail");
          localStorage.setItem("rememberMe", "false");
        }
      } catch (error) {
        console.error(error);
        setError("root", {
          message: t("login-no-account"),
        });
      }
    },
    [setError, t],
  );

  // Handler for 'remember me' checkbox changes
  const handleRememberMeChange = useCallback(
    (checked: boolean) => {
      setRememberMe(checked);
      setValue("rememberMe", checked);
    },
    [setRememberMe, setValue],
  );

  const handleFormSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      void handleSubmit(onSubmit)();
    },
    [handleSubmit, onSubmit],
  );

  return (
    <div className={styles.loginPageContainer}>
      <div className={styles.loginPageDiv}>
        <div className={styles.decorationText}>
          <h1>
            <strong> {t("log-in")} </strong>
          </h1>
          <h3 className={styles.welcomeback}> {t("welcome-back")}</h3>
        </div>

        <form onSubmit={handleFormSubmit} autoComplete="on">
          <div className={styles.inputFieldContainer}>
            <label htmlFor="email">{t("email")}</label>
            <input
              {...register("email")}
              id="email"
              type="text"
              placeholder={t("email")}
              autoComplete="on"
            />
          </div>

          <div className={styles.inputFieldContainer}>
            <label htmlFor="password">{t("password")}</label>
            <div>
              <input
                {...register("password")}
                id="password"
                type="password"
                placeholder={t("password")}
              />
              <div className={styles.formError}>
                {errors.email || errors.password ? t("invalid-login") : ""}
              </div>
            </div>
          </div>

          <Checkmark
            checked={rememberMe}
            onChange={handleRememberMeChange}
            label={t("remember-me")}
          />

          {/* Submit button is dynamically enabled/disabled based on form state */}
          <button
            className={`longButton ${!isValid ? "disabledButton" : ""}`}
            disabled={!isValid || isSubmitting}
            type="submit"
          >
            {isSubmitting ? t("loading") : t("log-in")}
          </button>

          {errors.root && <div className="text-red-500">{errors.root.message}</div>}

          <div style={{ display: "flex", flexDirection: "column" }}>
            <Link href="/forgotLogin"> {t("forgot-login-message")} </Link>
            <span>
              <span style={{ color: "black" }}> {t("dont-have-account")} </span>
              <Link href="/signup"> {t("create-account")} </Link>
            </span>
            {/* <Link href="/forgotLogin"> I&apos;m an admin </Link> */}
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
