"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Radio } from "@tritonse/tse-constellation";
import { useStateMachine } from "little-state-machine";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useContext, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";

import styles from "./DirectoryContact.module.css";
import { SpecialtyOption, specialtyOptionsToBackend } from "./DirectoryServices";

import { JoinDirectoryRequestBody, joinDirectory } from "@/api/directory";
import { Button } from "@/components";
import { PhoneInput } from "@/components/PhoneInput";
import { SuccessMessage } from "@/components/SuccessMessage";
import { UserContext } from "@/contexts/userContext";
import { directoryState } from "@/state/stateTypes";
import updateDirectoryForm from "@/state/updateDirectoryForm";

const formSchema = (t: (key: string) => string) =>
  z
    .object({
      workEmail: z.string().min(1, t("required")).email(t("invalid-email")),
      workPhone: z.string().min(1, t("required")),
      licenseType: z.enum(["has_license", "no_license"], { required_error: t("required") }),
      licenseNumber: z.string().optional(),
      noLicenseReason: z.string().optional(),
      additionalComments: z.string().optional(),
    })
    .refine(
      (data) => {
        if (data.licenseType === "has_license" && !data.licenseNumber?.trim()) {
          return false;
        }
        if (data.licenseType === "no_license" && !data.noLicenseReason?.trim()) {
          return false;
        }
        return true;
      },
      {
        message: t("field-required"),
        path: ["licenseNumber"],
      },
    );

type FormSchema = z.infer<ReturnType<typeof formSchema>>;

type DirectoryContactProps = {
  onReset: () => void;
  onBack: () => void;
};

export const DirectoryContact = ({ onReset, onBack }: DirectoryContactProps) => {
  const { t } = useTranslation();
  const { firebaseUser, reloadUser } = useContext(UserContext);
  const router = useRouter();
  const { state, actions } = useStateMachine({ actions: { updateDirectoryForm } });

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm<FormSchema>({
    defaultValues: state.directoryForm as FormSchema,
    resolver: zodResolver(formSchema(t)),
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const licenseType = watch("licenseType");

  const submitDirectoryRequest = async (formData: FormSchema) => {
    if (!firebaseUser) return;

    try {
      setIsSubmitting(true);
      setError("");
      setSuccessMessage("");

      const token = await firebaseUser.getIdToken();
      const requestBody: JoinDirectoryRequestBody = {
        education: {
          degree: state.directoryForm.educationType,
          otherDegree: "", // TODO
          institution: state.directoryForm.educationInstitution,
        },
        clinic: {
          name: state.directoryForm.workClinic,
          url: state.directoryForm.clinicWebsite,
          location: {
            country: state.directoryForm.clinicCountry.value,
            address: state.directoryForm.addressLine1,
            suite: state.directoryForm.addressLine2,
            city: state.directoryForm.city,
            state: state.directoryForm.state,
            zipPostCode: state.directoryForm.postcode,
          },
        },
        display: {
          workEmail: formData.workEmail,
          workPhone: formData.workPhone,
          services: state.directoryForm.specialtyServices.map(
            (service) => specialtyOptionsToBackend[service as SpecialtyOption],
          ),
          languages: state.directoryForm.careLanguages.map((language) => language.toLowerCase()),
          options: {
            openToAppointments: state.directoryForm.canMakeAppointments,
            openToRequests: state.directoryForm.canRequestTests,
            remote: state.directoryForm.offersTelehealth,
            authorizedCare: state.directoryForm.authorizedForLanguages,
          },
          license: formData.licenseType === "has_license" ? [formData.licenseNumber ?? ""] : [],
          comments: {
            noLicense: formData.noLicenseReason,
            additional: formData.additionalComments,
          },
        },
      };
      const res = await joinDirectory(requestBody, token);
      if (res.success) {
        setSuccessMessage(t("submitted-directory-info"));
        await reloadUser();
        router.push("/");
      } else {
        setError(`${t("failed-submit-directory")}: ${res.error}`);
      }
    } catch (err) {
      setError(`${t("failed-submit-directory")}: ${String(err)}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const onSubmit = (data: FormSchema) => {
    actions.updateDirectoryForm(data as directoryState["data"]);
    void submitDirectoryRequest(data);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    void handleSubmit(onSubmit)();
  };

  return (
    <div className={styles.container}>
      <form onSubmit={handleFormSubmit} className={styles.form}>
        <div>
          <h4>{t("page-3-of-3")}</h4>
          <h3 className={styles.sectionTitle}>{t("contact")}</h3>

          <div className={styles.questionSection}>
            <p className={styles.sectionText}>{t("professional-email-for-contact")}</p>
            <input
              type="email"
              {...register("workEmail")}
              className={styles.textInput}
              placeholder={t("enter-professional-email")}
            />
            <p className={styles.errorText}>
              {errors.workEmail ? errors.workEmail.message : "\u00A0"}
            </p>
          </div>

          <div className={styles.questionSection}>
            <p className={styles.sectionText}>{t("telephone-number-for-contact")}</p>
            <Controller
              name="workPhone"
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
            <p className={styles.errorText}>
              {errors.workPhone ? errors.workPhone.message : "\u00A0"}
            </p>
          </div>

          <div className={styles.questionSection}>
            <p className={styles.sectionText}>{t("license-number-question")}</p>
            <p className={styles.subText}>{t("license-info-privacy")}</p>

            <div className={styles.radioGroup}>
              <Controller
                name="licenseType"
                control={control}
                render={({ field }) => (
                  <>
                    <Radio
                      id="has-license"
                      label={t("has-license-label")}
                      checked={field.value === "has_license"}
                      onChange={() => {
                        field.onChange("has_license");
                      }}
                    />
                    <div className={styles.subField}>
                      <input
                        type="text"
                        {...register("licenseNumber")}
                        className={styles.textInput}
                        placeholder={t("enter-license-number")}
                      />
                      <p className={styles.errorText}>
                        {licenseType === "has_license" && errors.licenseNumber
                          ? t("field-required")
                          : "\u00A0"}
                      </p>
                    </div>

                    <Radio
                      id="no-license"
                      label={t("no-license-label")}
                      checked={field.value === "no_license"}
                      onChange={() => {
                        field.onChange("no_license");
                      }}
                    />
                    <div className={styles.subField}>
                      <input
                        type="text"
                        {...register("noLicenseReason")}
                        className={styles.textInput}
                        placeholder={t("reasoning")}
                      />
                      <p className={styles.errorText}>
                        {licenseType === "no_license" && errors.noLicenseReason
                          ? t("field-required")
                          : "\u00A0"}
                      </p>
                    </div>
                  </>
                )}
              />
              <p className={styles.errorText}>
                {errors.licenseType ? errors.licenseType.message : "\u00A0"}
              </p>
            </div>
          </div>

          <div className={styles.questionSection}>
            <p className={styles.sectionText}>{t("additional-comments-question")}</p>
            <input
              {...register("additionalComments")}
              className={styles.textArea}
              placeholder={t("type-here")}
            />
            <p className={styles.errorText}>
              {errors.additionalComments ? errors.additionalComments.message : "\u00A0"}
            </p>
          </div>
        </div>

        <div className={styles.buttonContainer}>
          <button type="button" className={styles.backButton} onClick={onBack}>
            <Image src="/icons/ic_caretleft.svg" alt="Back Icon" width={24} height={24} />
            {t("back")}
          </button>

          <Button
            type="submit"
            label={isSubmitting ? t("loading") : t("submit")}
            disabled={isSubmitting}
          />
        </div>

        {error && (
          <>
            <p className="text-red-600 text-center my-2">{error}</p>
            <div className="flex justify-center mt-4">
              <button
                onClick={onReset}
                className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100"
              >
                {t("start-over")}
              </button>
            </div>
          </>
        )}
      </form>
      <SuccessMessage
        message={successMessage}
        onDismiss={() => {
          setSuccessMessage("");
        }}
      />
    </div>
  );
};
