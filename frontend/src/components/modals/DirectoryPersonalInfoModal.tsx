"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Radio } from "@tritonse/tse-constellation";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";

import "./DirectoryPersonalInfoModal.css";
import { Modal } from "./Modal";
import { educationTypeOptions } from "./displayInfoConstants";

import { User, editDirectoryPersonalInfoRequest } from "@/api/users";
import { SuccessMessage } from "@/components/SuccessMessage";
import { UserContext } from "@/contexts/userContext";

const directoryInfoSchema = (t: (key: string) => string) =>
  z.object({
    degree: z.string().min(3, t("degree-3-characters")),
    institution: z.string().min(3, t("institution-3-characters")),
    license: z.string(),
  });

type DirectoryInfoFormData = z.infer<ReturnType<typeof directoryInfoSchema>>;

type DirectoryInfoModalProps = {
  isOpen: boolean;
  onClose: () => void;
  populationInfo: User | null;
};

export const DirectoryPersonalInfoModal: React.FC<DirectoryInfoModalProps> = ({
  isOpen,
  onClose,
  populationInfo,
}) => {
  const { t } = useTranslation();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
  } = useForm<DirectoryInfoFormData>({
    resolver: zodResolver(directoryInfoSchema(t)),
  });
  const { firebaseUser, reloadUser } = useContext(UserContext);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = useCallback<SubmitHandler<DirectoryInfoFormData>>(
    async (data) => {
      if (!firebaseUser) return;

      setErrorMessage("");
      setSuccessMessage("");
      setLoading(true);

      try {
        const formattedData = {
          newDegree: data.degree,
          newEducationInstitution: data.institution,
          newLicense: [data.license],
        };

        const firebaseToken = await firebaseUser.getIdToken();
        const response = await editDirectoryPersonalInfoRequest(formattedData, firebaseToken);
        if (response.success) {
          setSuccessMessage(t("directory-personal-information-updated"));
          await reloadUser();
          onClose();
        } else {
          setErrorMessage(`${t("error-updating-info-colon")}: ${response.error}`);
        }
      } catch (err) {
        setErrorMessage(`${t("error-updating-info-colon")}: ${String(err)}`);
      } finally {
        setLoading(false);
      }
    },
    [onClose, firebaseUser, reloadUser, t],
  );

  useEffect(() => {
    if (isOpen && populationInfo) {
      reset({
        degree: populationInfo.education?.degree,
        institution: populationInfo.education?.institution,
        license: populationInfo.display?.license?.[0] ?? "",
      });
    }
  }, [isOpen, populationInfo, reset]);

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        onSave={handleSubmit(onSubmit)}
        title={t("edit-personal-information")}
        loading={loading}
        content={
          <form className="modal-form">
            <div className="dir-info-form-group">
              <label htmlFor="degree">
                {t("degree-certification")}
                <span className="red">*</span>
              </label>

              <Controller
                name="degree"
                control={control}
                render={({ field }) => (
                  <>
                    {educationTypeOptions.map(({ label, value }) => (
                      <Radio
                        key={label}
                        id={`education-${label}`}
                        label={t(label)}
                        checked={field.value === value}
                        onChange={() => {
                          field.onChange(value);
                        }}
                      />
                    ))}
                  </>
                )}
              />
              <p className="error-message">{errors.degree?.message ?? "\u00A0"}</p>
            </div>

            <div className="dir-info-form-group">
              <label htmlFor="institution">
                {t("institution")}
                <span className="red">*</span>
              </label>
              <input
                className="dir-info-form-input"
                id="institution"
                {...register("institution")}
                placeholder={t("institution-placeholder")}
              />
              <p className="error-message">{errors.institution?.message ?? "\u00A0"}</p>
            </div>

            <div className="dir-info-form-group">
              <label htmlFor="license">{t("license-number")}</label>
              <input
                className="dir-info-form-input"
                id="license"
                {...register("license")}
                placeholder={"12345678"}
              />
              <p className="error-message">{errors.license?.message ?? "\u00A0"}</p>
            </div>

            {errorMessage && <div className="text-red-500">{errorMessage}</div>}
          </form>
        }
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
