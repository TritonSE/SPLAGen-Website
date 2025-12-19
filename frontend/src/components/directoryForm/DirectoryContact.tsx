"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Radio } from "@tritonse/tse-constellation";
import { useStateMachine } from "little-state-machine";
import Image from "next/image";
import { useCallback } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

import styles from "./DirectoryContact.module.css";

import { Button } from "@/components";
import { PhoneInput } from "@/components/PhoneInput";
import { directoryState } from "@/state/stateTypes";
import updateDirectoryForm from "@/state/updateDirectoryForm";

const formSchema = z
  .object({
    email: z.string().min(1, "Required").email("Please enter a valid email address"),
    phone: z.string().min(1, "Required"),
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
  onNext: (data: directoryState["data"]) => void;
  onBack: () => void;
};

export const DirectoryContact = ({ onNext, onBack }: DirectoryContactProps) => {
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

  const licenseType = watch("licenseType");

  const onSubmit = useCallback(
    (data: FormSchema) => {
      actions.updateDirectoryForm(data as directoryState["data"]);
      onNext(data as directoryState["data"]);
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
    <div className={styles.container}>
      <form onSubmit={handleFormSubmit} className={styles.form}>
        <div>
          <h4>Page 3 of 3</h4>
          <h3 className={styles.sectionTitle}>Contact</h3>

          <div className={styles.questionSection}>
            <p className={styles.sectionText}>Professional email for patients to contact you</p>
            <input
              type="email"
              {...register("email")}
              className={styles.textInput}
              placeholder="Enter your professional email"
            />
            <p className={styles.errorText}>{errors.email ? errors.email.message : "\u00A0"}</p>
          </div>

          <div className={styles.questionSection}>
            <p className={styles.sectionText}>Telephone number for patients to contact you</p>
            <Controller
              name="phone"
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
            <p className={styles.errorText}>{errors.phone ? errors.phone.message : "\u00A0"}</p>
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

          <Button type="submit" label="Continue" />
        </div>
      </form>
    </div>
  );
};
