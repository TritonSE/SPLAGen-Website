"use client";

import { useStateMachine } from "little-state-machine";
import { useCallback, useState } from "react";
import { Controller, useForm } from "react-hook-form";

import { onboardingState } from "../../state/stateTypes";
import updateOnboardingForm from "../../state/updateOnboardingForm";

import styles from "./Step1.module.css";

type Step1Props = {
  onNext: (data: onboardingState["data"]) => void;
};

export const Step1 = ({ onNext }: Step1Props) => {
  const { state, actions } = useStateMachine({ actions: { updateOnboardingForm } });

  const [healthcareExpanded, setHealthcareExpanded] = useState(false);

  const [associateExpanded, setAssociateExpanded] = useState(false);

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
          <select {...register("country")} className={styles.input} defaultValue="">
            <option value="" disabled>
              Select country
            </option>
            <option value="AR">Argentina</option>
            <option value="BO">Bolivia</option>
            <option value="BR">Brazil</option>
            <option value="CL">Chile</option>
            <option value="CO">Colombia</option>
            <option value="CR">Costa Rica</option>
            <option value="CU">Cuba</option>
            <option value="DO">Dominican Republic</option>
            <option value="EC">Ecuador</option>
            <option value="SV">El Salvador</option>
            <option value="GT">Guatemala</option>
            <option value="HN">Honduras</option>
            <option value="MX">Mexico</option>
            <option value="NI">Nicaragua</option>
            <option value="PA">Panama</option>
            <option value="PY">Paraguay</option>
            <option value="PE">Peru</option>
            <option value="PR">Puerto Rico</option>
            <option value="UY">Uruguay</option>
            <option value="VE">Venezuela</option>
          </select>
        </div>

        <div>
          <label className={styles.label}>Preferred Language(s)</label>
          <Controller
            name="languages"
            control={control}
            defaultValue={[]}
            render={({ field: { onChange, value = [] } }) => (
              <div className={styles.languageGrid}>
                {languageOptions.map((option) => (
                  <div key={option.value} className={styles.checkboxItem}>
                    <input
                      type="checkbox"
                      id={option.value}
                      checked={value.includes(option.value)}
                      onChange={(e) => {
                        const isChecked = e.target.checked;
                        if (isChecked) {
                          onChange([...value, option.value]);
                        } else {
                          onChange(value.filter((v: string) => v !== option.value));
                        }
                      }}
                    />
                    <label htmlFor={option.value}>{option.label}</label>
                  </div>
                ))}
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
              <span className={styles.expandIcon}>{healthcareExpanded ? "-" : "+"}</span>
              <h4 className={styles.expandableTitle}>Healthcare Provider Membership</h4>
            </div>

            {healthcareExpanded && (
              <div className={styles.expandableContent}>
                <p>
                  Lorem ipsum odor amet, consectetuer adipiscing elit. Netus habitant adipiscing
                  curabitur phasellus non. Molestie condimentum dictum integer conubia; nisi
                  lobortis. Hac hendrerit purus dapibus ullamcorper; litora urna.
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
              <span className={styles.expandIcon}>{associateExpanded ? "−" : "+"}</span>
              <h4 className={styles.expandableTitle}>Associate Membership</h4>
            </div>

            {associateExpanded && (
              <div className={styles.expandableContent}>
                <p>
                  Lorem ipsum odor amet, consectetuer adipiscing elit. Netus habitant adipiscing
                  curabitur phasellus non. Molestie condimentum dictum integer conubia; nisi
                  lobortis. Hac hendrerit purus dapibus ullamcorper; litora urna.
                </p>
              </div>
            )}
          </div>
        </div>

        <div>
          <button type="submit">Next</button>
        </div>
      </form>
    </div>
  );
};
