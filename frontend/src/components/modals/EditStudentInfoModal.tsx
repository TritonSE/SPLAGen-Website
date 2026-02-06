"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Radio } from "@tritonse/tse-constellation";
import dynamic from "next/dynamic";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
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

const schema = z.object({
  schoolCountry: z.object({
    value: z.string().min(1, "School country is required"),
    label: z.string(),
  }),
  schoolName: z.string().min(1, "School name is required"),
  universityEmail: z.string().email("Invalid email format"),
  degree: z.enum(["masters", "diploma", "fellowship", "md", "phd", "other"], {
    errorMap: () => ({ message: "Please select a degree" }),
  }),
  programName: z.string().min(1, "Program name is required"),
  gradDate: z.string().min(1, "Graduation date is required"),
});

type FormData = z.infer<typeof schema>;

export const EditStudentInfoModal = ({
  isOpen,
  onClose,
  populationInfo,
}: {
  isOpen: boolean;
  onClose: () => void;
  populationInfo: User | null;
}) => {
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
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
          setSuccessMessage("Student information updated successfully!");
          await reloadUser();
          onClose();
        } else {
          setError(`Error updating info: ${response.error}`);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    },
    [firebaseUser, reloadUser, onClose],
  );

  const handleSave = useCallback(() => {
    void handleSubmit(onSubmit)();
  }, [handleSubmit, onSubmit]);

  const content = (
    <>
      <div className={styles.field}>
        <label className={styles.label}>School Location</label>
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
        <label className={styles.label}>School Name</label>
        <input
          {...register("schoolName")}
          className={styles.input}
          placeholder="e.g., University of California, San Diego"
        />
        {errors.schoolName && <span className={styles.error}>{errors.schoolName.message}</span>}
      </div>

      <div className={styles.field}>
        <label className={styles.label}>University Email</label>
        <input
          {...register("universityEmail")}
          className={styles.input}
          placeholder="Enter your school email"
          type="email"
        />
        {errors.universityEmail && (
          <span className={styles.error}>{errors.universityEmail.message}</span>
        )}
      </div>

      <div className={styles.field}>
        <label className={styles.label}>Degree</label>
        <div className={styles.radioGroup}>
          <Radio
            id="degree-ms"
            label="MS"
            checked={selectedDegree === "masters"}
            onChange={() => {
              setValue("degree", "masters");
            }}
          />
          <Radio
            id="degree-phd"
            label="PhD"
            checked={selectedDegree === "phd"}
            onChange={() => {
              setValue("degree", "phd");
            }}
          />
          <Radio
            id="degree-md"
            label="MD"
            checked={selectedDegree === "md"}
            onChange={() => {
              setValue("degree", "md");
            }}
          />
        </div>
        {errors.degree && <span className={styles.error}>{errors.degree.message}</span>}
      </div>

      <div className={styles.field}>
        <label className={styles.label}>Program Name or Department</label>
        <input {...register("programName")} className={styles.input} placeholder="Enter name" />
        {errors.programName && <span className={styles.error}>{errors.programName.message}</span>}
      </div>

      <div className={styles.field}>
        <label className={styles.label}>Graduation Date</label>
        <input {...register("gradDate")} className={styles.input} placeholder="MM/YY" />
        {errors.gradDate && <span className={styles.error}>{errors.gradDate.message}</span>}
      </div>
    </>
  );

  return (
    <>
      <Modal
        title="Edit Student Information"
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
