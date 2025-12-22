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

const formSchema = z
  .object({
    workEmail: z.string().min(1, "Required").email("Please enter a valid email address"),
    workPhone: z.string().min(1, "Required"),
    licenseType: z.enum(["has_license", "no_license"], { required_error: "Required" }),
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
      message: "This field is required",
      path: ["licenseNumber"],
    },
  );

type FormSchema = z.infer<typeof formSchema>;

type DirectoryContactProps = {
  onReset: () => void;
  onBack: () => void;
};

export const DirectoryContact = ({ onReset, onBack }: DirectoryContactProps) => {
  const { t } = useTranslation();
  const { firebaseUser } = useContext(UserContext);
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
    resolver: zodResolver(formSchema),
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const licenseType = watch("licenseType");

  const submitDirectoryRequest = async () => {
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
          workEmail: state.directoryForm.workEmail,
          workPhone: state.directoryForm.workPhone,
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
          license:
            state.directoryForm.licenseType === "has_license"
              ? [state.directoryForm.licenseNumber]
              : [],
          comments: {
            noLicense: state.directoryForm.noLicenseReason,
            additional: state.directoryForm.additionalComments,
          },
        },
      };
      const res = await joinDirectory(requestBody, token);
      if (res.success) {
        setSuccessMessage("Submitted directory info");
        setTimeout(() => {
          router.push("/");
        }, 2000);
      } else {
        setError(`Failed to submit directory info: ${res.error}`);
      }
    } catch (err) {
      setError(`Failed to submit directory info: ${String(err)}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const onSubmit = (data: FormSchema) => {
    actions.updateDirectoryForm(data as directoryState["data"]);
    void submitDirectoryRequest();
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    void handleSubmit(onSubmit)();
  };

  return (
    <div className={styles.container}>
      <form onSubmit={handleFormSubmit} className={styles.form}>
        <div>
          <h4>Page 3 of 3</h4>
          <h3 className={styles.sectionTitle}>Contact</h3>

          <div className={styles.questionSection}>
            <p className={styles.sectionText}>Professional email for patients to contact you</p>
            <input
              type="workEmail"
              {...register("workEmail")}
              className={styles.textInput}
              placeholder="Enter your professional email"
            />
            <p className={styles.errorText}>
              {errors.workEmail ? errors.workEmail.message : "\u00A0"}
            </p>
          </div>

          <div className={styles.questionSection}>
            <p className={styles.sectionText}>Telephone number for patients to contact you</p>
            <Controller
              name="workPhone"
              control={control}
              render={({ field }) => (
                <PhoneInput
                  placeholder="Enter your phone number"
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
            <p className={styles.sectionText}>
              What is your license number to practice medicine or genetic counseling?
            </p>
            <p className={styles.subText}>
              We use this information to assure the public that everyone in our directory can
              provide genetic counseling services. We will not share this information with the
              public.
            </p>

            <div className={styles.radioGroup}>
              <Controller
                name="licenseType"
                control={control}
                render={({ field }) => (
                  <>
                    <Radio
                      id="has-license"
                      label="My medical or genetic counseling license number is..."
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
                        placeholder="Enter medical or genetic counseling license number"
                      />
                      <p className={styles.errorText}>
                        {licenseType === "has_license" && errors.licenseNumber
                          ? "This field is required"
                          : "\u00A0"}
                      </p>
                    </div>

                    <Radio
                      id="no-license"
                      label="I do not have a medical or genetic counseling license number because..."
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
                        placeholder="Reasoning"
                      />
                      <p className={styles.errorText}>
                        {licenseType === "no_license" && errors.noLicenseReason
                          ? "This field is required"
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
            <p className={styles.sectionText}>
              Any additional comments you have regarding the questions mentioned above
            </p>
            <input
              {...register("additionalComments")}
              className={styles.textArea}
              placeholder="Type here"
            />
            <p className={styles.errorText}>
              {errors.additionalComments ? errors.additionalComments.message : "\u00A0"}
            </p>
          </div>
        </div>

        <div className={styles.buttonContainer}>
          <button type="button" className={styles.backButton} onClick={onBack}>
            <Image src="/icons/ic_caretleft.svg" alt="Back Icon" width={24} height={24} />
            Back
          </button>

          <Button
            type="submit"
            label={isSubmitting ? t("loading") : "Submit"}
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
