"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Radio } from "@tritonse/tse-constellation";
import dynamic from "next/dynamic";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";

import styles from "./EditStudentInfoModal.module.css";
import { Modal } from "./Modal";

import type { CountryOption } from "@/components";

import { User, updateStudentInfo } from "@/api/users";
import { getCountryOptions } from "@/components/CountrySelector";
import { SuccessMessage } from "@/components/SuccessMessage";
import { UserContext } from "@/contexts/userContext";

const CountrySelector = dynamic(() => import("@/components").then((mod) => mod.CountrySelector), {
  ssr: false,
});

const schema = (t: (key: string) => string) =>
  z.object({
    schoolCountry: z.object({
      value: z.string().min(1, t("school-country-required")),
      label: z.string(),
    }),
    schoolName: z.string().min(1, t("school-name-required")),
    universityEmail: z.string().email(t("invalid-email-format")),
    degree: z.enum(["masters", "diploma", "fellowship", "md", "phd", "other"], {
      errorMap: () => ({ message: t("please-select-degree") }),
    }),
    programName: z.string().min(1, t("program-name-required")),
    gradDate: z.string().min(1, t("graduation-date-required")),
  });

type FormData = z.infer<ReturnType<typeof schema>>;

export const EditStudentInfoModal = ({
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
    watch,
    setValue,
  } = useForm<FormData>({
    resolver: zodResolver(schema(t)),
  });

  const { firebaseUser, reloadUser } = useContext(UserContext);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<CountryOption | null>(null);

  const selectedDegree = watch("degree") || "";

  useEffect(() => {
    if (isOpen && populationInfo) {
      const schoolCountry = populationInfo.education?.schoolCountry
        ? getCountryOptions().find(
            (option) => option.value === populationInfo.education?.schoolCountry,
          )
        : undefined;
      reset({
        schoolCountry,
        schoolName: populationInfo.education?.institution,
        universityEmail: populationInfo.education?.email,
        degree: populationInfo.education?.degree,
        programName: populationInfo.education?.program,
        gradDate: populationInfo.education?.gradDate,
      });
      if (schoolCountry) {
        setSelectedCountry(schoolCountry);
      }
    }
  }, [isOpen, populationInfo, reset]);

  const onSubmit = useCallback<SubmitHandler<FormData>>(
    async (data) => {
      if (!firebaseUser) return;

      setError("");
      setSuccessMessage("");
      setLoading(true);

      try {
        const firebaseToken = await firebaseUser.getIdToken();

        // Normalize degree
        const normalizedDegree = data.degree?.toLowerCase() || "other";

        const response = await updateStudentInfo(firebaseToken, {
          schoolCountry: data.schoolCountry.value,
          schoolName: data.schoolName,
          universityEmail: data.universityEmail,
          degree: normalizedDegree,
          programName: data.programName,
          gradDate: data.gradDate,
        });

        if (response.success) {
          setSuccessMessage(t("student-information-updated"));
          await reloadUser();
          onClose();
        } else {
          setError(`${t("error-updating-info-colon")}: ${response.error}`);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : t("an-error-occurred"));
      } finally {
        setLoading(false);
      }
    },
    [firebaseUser, reloadUser, onClose, t],
  );

  const handleSave = useCallback(() => {
    void handleSubmit(onSubmit)();
  }, [handleSubmit, onSubmit]);

  const content = (
    <>
      <div className={styles.field}>
        <label className={styles.label}>{t("school-location")}</label>
        <Controller
          name="schoolCountry"
          control={control}
          render={({ field }) => (
            <CountrySelector
              value={selectedCountry}
              onChange={(option) => {
                setSelectedCountry(option);
                field.onChange(option);
              }}
            />
          )}
        />
        {errors.schoolCountry && (
          <span className={styles.error}>
            {/* eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing */}
            {errors.schoolCountry.value?.message || errors.schoolCountry.message}
          </span>
        )}
      </div>

      <div className={styles.field}>
        <label className={styles.label}>{t("school-name")}</label>
        <input
          {...register("schoolName")}
          className={styles.input}
          placeholder={t("school-name-placeholder")}
        />
        {errors.schoolName && <span className={styles.error}>{errors.schoolName.message}</span>}
      </div>

      <div className={styles.field}>
        <label className={styles.label}>{t("university-email")}</label>
        <input
          {...register("universityEmail")}
          className={styles.input}
          placeholder={t("enter-school-email")}
          type="email"
        />
        {errors.universityEmail && (
          <span className={styles.error}>{errors.universityEmail.message}</span>
        )}
      </div>

      <div className={styles.field}>
        <label className={styles.label}>{t("degree")}</label>
        <div className={styles.radioGroup}>
          <Radio
            id="degree-ms"
            label={t("masters")}
            checked={selectedDegree === "masters"}
            onChange={() => {
              setValue("degree", "masters");
            }}
          />
          <Radio
            id="degree-phd"
            label={t("phd")}
            checked={selectedDegree === "phd"}
            onChange={() => {
              setValue("degree", "phd");
            }}
          />
          <Radio
            id="degree-md"
            label={t("md")}
            checked={selectedDegree === "md"}
            onChange={() => {
              setValue("degree", "md");
            }}
          />
        </div>
        {errors.degree && <span className={styles.error}>{errors.degree.message}</span>}
      </div>

      <div className={styles.field}>
        <label className={styles.label}>{t("program-name-or-department")}</label>
        <input
          {...register("programName")}
          className={styles.input}
          placeholder={t("enter-name")}
        />
        {errors.programName && <span className={styles.error}>{errors.programName.message}</span>}
      </div>

      <div className={styles.field}>
        <label className={styles.label}>{t("graduation-date")}</label>
        <input
          {...register("gradDate")}
          className={styles.input}
          placeholder={t("graduation-date-placeholder")}
        />
        {errors.gradDate && <span className={styles.error}>{errors.gradDate.message}</span>}
      </div>
    </>
  );

  return (
    <>
      <Modal
        title={t("edit-student-information")}
        content={content}
        isOpen={isOpen}
        onClose={onClose}
        onSave={handleSave}
        loading={loading}
      />
      {error && <p className={styles.errorMessage}>{error}</p>}
      {successMessage && (
        <SuccessMessage
          message={successMessage}
          onDismiss={() => {
            setSuccessMessage("");
          }}
        />
      )}
    </>
  );
};
