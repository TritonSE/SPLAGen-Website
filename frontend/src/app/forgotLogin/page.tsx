"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useTranslation } from "react-i18next";

import { resetUserPassword } from "@/api/users";
import styles from "@/app/login/login.module.css";
import { useRedirectToHomeIfSignedIn } from "@/hooks/useRedirection";

const ForgotLogin = () => {
  const [email, setEmail] = useState("");
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();

  useRedirectToHomeIfSignedIn();

  const isValid = email !== "";

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!email) return;

    setSuccess(false);
    setError("");
    setLoading(true);

    try {
      const res = await resetUserPassword(email);
      if (res.success) {
        setSuccess(true);
      } else {
        setError(`${t("failed-to-reset-password")}: ${res.error}`);
      }
    } catch (err) {
      setError(`${t("failed-to-reset-password")}: ${String(err)}`);
    } finally {
      setLoading(false);
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
            className={`longButton ${!isValid || loading ? "disabledButton" : ""}`}
            disabled={!isValid || loading}
            type="submit"
          >
            {loading ? t("loading") : t("send-reset-email")}
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
