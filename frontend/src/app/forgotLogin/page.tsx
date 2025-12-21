"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useTranslation } from "react-i18next";
import styles from "src/app/login/login.module.css";

import { resetUserPassword } from "@/api/users";

const ForgotLogin = () => {
  const [email, setEmail] = useState("");
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const { t } = useTranslation();

  const isValid = email !== "";

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!email) return;

    setSuccess(false);
    setError("");

    const res = await resetUserPassword(email);
    if (res.success) {
      setSuccess(true);
    } else {
      setError(`Failed to reset password: ${res.error}`);
    }
  };

  return (
    <div className={styles.loginPageContainer}>
      <div className={styles.loginPageDiv}>
        {success && (
          <div className="mb-4 p-4 bg-green-100 text-green-700 rounded-md">
            <p className="font-bold">{t("password-reset-sent")}</p>
            <p>{t("check-spam-folder")}</p>
          </div>
        )}
        <div className={styles.decorationText}>
          <h1>
            <strong> {t("reset-password")} </strong>
          </h1>
        </div>

        <form
          onSubmit={(e) => {
            void onSubmit(e);
          }}
          autoComplete="on"
        >
          <div className={styles.inputFieldContainer}>
            <label htmlFor="email">{t("email")}</label>
            <input
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
              type="text"
              placeholder={t("email")}
              autoComplete="on"
            />
          </div>

          {/* Submit button is dynamically enabled/disabled based on form state */}
          <button
            className={`longButton ${!isValid ? "disabledButton" : ""}`}
            disabled={!isValid}
            type="submit"
          >
            {t("send-reset-email")}
          </button>

          {error && <div className="text-red-500">{error}</div>}

          <div style={{ display: "flex", flexDirection: "column" }}>
            <span>
              <span style={{ color: "black" }}> {t("remembered-password")} </span>
              <Link href="/login"> {t("log-in")} </Link>
            </span>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgotLogin;
