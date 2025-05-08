"use client";

import { useStateMachine } from "little-state-machine";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useCallback, useState } from "react";
import { Controller, useForm } from "react-hook-form";

import styles from "./Basics.module.css";

import type { CountryOption, ProfessionalTitleOption } from "@/components";

import { Button, Checkmark, ExpandableSection } from "@/components";
import { onboardingState } from "@/state/stateTypes";
import updateOnboardingForm from "@/state/updateOnboardingForm";

const CountrySelector = dynamic(() => import("@/components").then((mod) => mod.CountrySelector), {
  ssr: false,
});

const ProfessionalTitleSelector = dynamic(
  () => import("@/components").then((mod) => mod.ProfessionalTitleSelector),
  {
    ssr: false,
  },
);

type BasicsProps = {
  onNext: (data: onboardingState["data"]) => void;
  onBack: () => void;
};

export const Basics = ({ onNext, onBack }: BasicsProps) => {
  const { state, actions } = useStateMachine({ actions: { updateOnboardingForm } });

  const [selectedCountry, setSelectedCountry] = useState<CountryOption | null>(null);

  const [selectedProfessionalTitle, setSelectedProfessionalTitle] =
    useState<ProfessionalTitleOption | null>(null);

  const { handleSubmit, control } = useForm<onboardingState["data"]>({
    defaultValues: state.onboardingForm,
  });

  const onSubmit = useCallback(
    (data: onboardingState["data"]) => {
      actions.updateOnboardingForm(data);
      onNext(data);
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

  const languageOptions = [
    { value: "ES", label: "Spanish" },
    { value: "EN", label: "English" },
    { value: "PT", label: "Portuguese" },
    { value: "OTH", label: "Other" },
  ];

  return (
    <div className={styles.container}>
      <form onSubmit={handleFormSubmit} className={styles.form}>
        <div>
          <h2 className={styles.title}>Let&apos;s start with the basics</h2>
          <p className={styles.subtitle}>Help us get to know you</p>
        </div>

        <div>
          <label className={styles.label}>Professional Title</label>
          <Controller
            name="professionalTitle"
            control={control}
            defaultValue={state.onboardingForm?.professionalTitle || ""}
            render={({ field }) => (
              <ProfessionalTitleSelector
                value={selectedProfessionalTitle ?? state.onboardingForm?.professionalTitle}
                onChange={(option) => {
                  setSelectedProfessionalTitle(option);
                  field.onChange(option);
                }}
              />
            )}
          />
        </div>

        <div>
          <label className={styles.label}>
            Country
            <span className={styles.optionalText}> (optional)</span>
          </label>
          <Controller
            name="country"
            control={control}
            defaultValue={state.onboardingForm?.country || ""}
            render={({ field }) => (
              <CountrySelector
                value={selectedCountry ?? state.onboardingForm?.country}
                onChange={(option) => {
                  setSelectedCountry(option);
                  field.onChange(option);
                }}
                placeholder="Select country"
              />
            )}
          />
        </div>

        <div>
          <label className={styles.label}>Preferred Language(s)</label>
          <Controller
            name="languages"
            control={control}
            defaultValue={[]}
            render={({ field: { onChange, value = [] } }) => (
              <div className={styles.languageGrid}>
                {languageOptions.map((option) => {
                  const isChecked = value.includes(option.value);
                  return (
                    <div key={option.value} className={styles.checkboxItem}>
                      <Checkmark
                        checked={isChecked}
                        onChange={() => {
                          if (isChecked) {
                            onChange(value.filter((v: string) => v !== option.value));
                          } else {
                            onChange([...value, option.value]);
                          }
                        }}
                        label={option.label}
                      />
                    </div>
                  );
                })}
              </div>
            )}
          />
        </div>

        <div className={styles.membershipSection}>
          <h3 className={styles.sectionTitle}>Membership</h3>
          <p className={styles.sectionText}>
            The next section of the questionnaire will place you in a membership category. First,
            review the different types below by clicking on the &quot;+&quot; icon.
          </p>

          <h4 className={styles.membershipLabel}>Healthcare Provider</h4>
          <ExpandableSection
            title="Healthcare Provider Membership"
            content="Full membership should be extended to any individual who has an MD, master's or doctorate degree in a related field, such as nursing, social work or public health, and has had formal training in genetic counseling with at least 1 year of formal clinical training in genetics or has obtained a certificate in genetic counseling training and has at least 3 years of clinical experience in a role where their primary responsibility is genetic counseling. Full members can attend all meetings of members, vote, serve as officers, committee chairs and on the Board of Directors."
          />

          <h4 className={styles.membershipLabel}>Associate Member</h4>
          <ExpandableSection
            title="Associate Membership"
            content="Associate membership will be granted to all applicants interested in supporting the mission of Splagen and who are not eligible for full or student membership. Interested individuals can submit an application and, upon approval by officials, associated membership can be granted or denied. Associate members have all the privileges of full members, but are not eligible for a position on the Board of Directors and can only vote, hold positions as committee chairs and leadership positions related to their specialty and professional background."
          />

          <h4 className={styles.membershipLabel}>Genetic Counselor</h4>
          <ExpandableSection
            title="Genetic Counselor Membership"
            content="Full membership should be extended to any individual who holds a master's degree from an accredited genetic counseling training program. Full members can attend all meetings open to members, vote, serve as officers, committee chairs and on the Board of Directors."
          />

          <h4 className={styles.membershipLabel}>Student</h4>
          <ExpandableSection
            title="Student Membership"
            content="Student membership will be granted to students enrolled in genetic counseling programs offered by an accredited institution, as well as to students enrolled in other degree-granting programs and who are interested in supporting the mission of society. Interested students can submit an application and, upon approval by officials, student membership can be granted or denied. Student members have the privileges of full members; however, they will not be granted a vote on issues or elections open to full and associate members. Student members are not eligible to serve on the Board of Directors or as committee chairs, with the exception of any committee specifically created for students. Student leadership roles will be filled by genetic counseling students."
          />
        </div>

        <div className={styles.buttonContainer}>
          <button type="button" onClick={onBack} className={styles.backButton}>
            <Image src="/icons/ic_caretleft.svg" alt="Back Icon" width={24} height={24} />
            Back
          </button>

          <Button type="submit" label="Continue" />
        </div>
      </form>
    </div>
  );
};
