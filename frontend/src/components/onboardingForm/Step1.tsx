"use client";

import { useStateMachine } from "little-state-machine";
import dynamic from 'next/dynamic'
import { useCallback, useState } from "react";
import { Controller, useForm } from "react-hook-form";

import styles from "./Step1.module.css";

import type {CountryOption} from "@/components";

import { Checkmark } from "@/components";
import { onboardingState } from "@/state/stateTypes";
import updateOnboardingForm from "@/state/updateOnboardingForm";

const CountrySelector = dynamic(() => import('@/components').then(mod => mod.CountrySelector), {
  ssr: false
});

type Step1Props = {
  onNext: (data: onboardingState["data"]) => void;
};

export const Step1 = ({ onNext }: Step1Props) => {
  const { state, actions } = useStateMachine({ actions: { updateOnboardingForm } });

  const [selectedCountry, setSelectedCountry] = useState<CountryOption | null>(null);

  const [healthcareExpanded, setHealthcareExpanded] = useState(false);

  const [associateExpanded, setAssociateExpanded] = useState(false);

  const [geneticExpanded, setGeneticExpanded] = useState(false);

  const [studentExpanded, setStudentExpanded] = useState(false);

  const { register, handleSubmit, control } = useForm<onboardingState["data"]>({
    defaultValues: state.onboardingForm,
  });

  const onSubmit = useCallback(
    (data: onboardingState["data"]) => {
      actions.updateOnboardingForm(data);
      onNext(data);
    },
    [actions.updateOnboardingForm, onNext],
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
          <h2 className={styles.title}>{"Let's start with the basics"}</h2>
          <p className={styles.subtitle}>Help us get to know you</p>
        </div>

        <div>
          <label className={styles.label}>Professional Title</label>
          <input
            {...register("professionalTitle")}
            className={styles.input}
            placeholder="e.g., Genetic Counselor"
          />
        </div>

        <div>
          <label className={styles.label}>Country</label>
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
            review the different types below.
          </p>

          <h4>Healthcare Provider</h4>

          {/* Healthcare Provider Expandable */}
          <div className={styles.expandableSection}>
            <div
              className={styles.expandableHeader}
              onClick={() => {
                setHealthcareExpanded(!healthcareExpanded);
              }}
            >
              <span className={styles.expandIcon}>{healthcareExpanded ? "X" : "+"}</span>
              <h4 className={styles.expandableTitle}>Healthcare Provider Membership</h4>
            </div>

            {healthcareExpanded && (
              <div className={styles.expandableContent}>
                <p>
                Full membership should be extended to any individual who has an MD, master&apos;s or doctorate degree in a related field, such as nursing, social work or public health, and has had formal training in genetic counseling with at least 1 year of formal clinical training in genetics or has obtained a certificate in genetic counseling training and has at least 3 years of clinical experience in a role where their primary responsibility is genetic counseling. Full members can attend all meetings of members, vote, serve as officers, committee chairs and on the Board of Directors.
                </p>
              </div>
            )}
          </div>

          <h4>Associate Member</h4>

          {/* Associate Membership Expandable */}
          <div className={styles.expandableSection}>
            <div
              className={styles.expandableHeader}
              onClick={() => {
                setAssociateExpanded(!associateExpanded);
              }}
            >
              <span className={styles.expandIcon}>{associateExpanded ? "X" : "+"}</span>
              <h4 className={styles.expandableTitle}>Associate Membership</h4>
            </div>

            {associateExpanded && (
              <div className={styles.expandableContent}>
                <p>
                Associate membership will be granted to all applicants interested in supporting the mission of Splagen and who are not eligible for full or student membership. Interested individuals can submit an application and, upon approval by officials, associated membership can be granted or denied. Associate members have all the privileges of full members, but are not eligible for a position on the Board of Directors and can only vote, hold positions as committee chairs and leadership positions related to their specialty and professional background.
                </p>
              </div>
            )}
          </div>


          <h4>Genetic Counselor</h4>

          {/* Genetic Counselor Membership Expandable */}
          <div className={styles.expandableSection}>
            <div
              className={styles.expandableHeader}
              onClick={() => {
                setGeneticExpanded(!geneticExpanded);
              }}
            >
              <span className={styles.expandIcon}>{geneticExpanded ? "X" : "+"}</span>
              <h4 className={styles.expandableTitle}>Genetic Counselor Membership</h4>
            </div>

            {geneticExpanded && (
              <div className={styles.expandableContent}>
                <p>
                {"Full membership should be extended to any individual who holds a master's degree from an accredited genetic counseling training program. Full members can attend all meetings open to members, vote, serve as officers, committee chairs and on the Board of Directors."}
                </p>
              </div>
            )}
          </div>

          <h4>Student</h4>

          {/* Student Membership Expandable */}

          <div className={styles.expandableSection}>
            <div
              className={styles.expandableHeader}
              onClick={() => {
                setStudentExpanded(!studentExpanded);
              }}
            >
              <span className={styles.expandIcon}>{studentExpanded ? "X" : "+"}</span>
              <h4 className={styles.expandableTitle}>Student Membership</h4>
            </div>

            {studentExpanded && (
              <div className={styles.expandableContent}>
                <p>
                {"Student membership will be granted to students enrolled in genetic counseling programs offered by an accredited institution, as well as to students enrolled in other degree-granting programs and who are interested in supporting the mission of society. Interested students can submit an application and, upon approval by officials, student membership can be granted or denied. Student members have the privileges of full members; however, they will not be granted a vote on issues or elections open to full and associate members. Student members are not eligible to serve on the Board of Directors or as committee chairs, with the exception of any committee specifically created for students. Student leadership roles will be filled by genetic counseling students."}
                </p>
              </div>
            )}
          </div>
        </div>
        
        <div className={styles.buttonContainer}>
          <button type="button" className={styles.backButton}>  {/* make on back */}
            Back
          </button>
          <button type="submit" className={styles.continueButton}>Continue</button>
        </div>
      </form>
    </div>
  );
};
