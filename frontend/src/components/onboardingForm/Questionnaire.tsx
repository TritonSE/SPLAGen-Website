"use client";
import { Radio } from "@tritonse/tse-constellation";
import { useStateMachine } from "little-state-machine";
import Image from "next/image";
import { useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import styles from "./Questionnaire.module.css";

import { Button, ExpandableSection } from "@/components";
import { onboardingState } from "@/state/stateTypes";
import updateOnboardingForm from "@/state/updateOnboardingForm";

type QuestionnaireProps = {
  onNext: (data: onboardingState["data"]) => void;
  onBack: () => void;
  onStudentFlow: () => void;
  onAssociateFlow: () => void;
};

export const Questionnaire: React.FC<QuestionnaireProps> = ({
  onNext,
  onBack,
  onStudentFlow,
  onAssociateFlow,
}) => {
  const { t } = useTranslation();
  const { state, actions } = useStateMachine({ actions: { updateOnboardingForm } });
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const handleSelection = useCallback(
    (question: string, answer: string) => {
      let updatedAnswers = { ...answers };

      // Reset dependent fields when an earlier question changes
      if (question === "field1") {
        updatedAnswers = { field1: answer };
      } else if (question === "field2") {
        updatedAnswers = { ...answers, field2: answer };
        delete updatedAnswers.field3;
        delete updatedAnswers.field4;
      } else if (question === "field3") {
        updatedAnswers = { ...answers, field3: answer };
        delete updatedAnswers.field4;
      } else {
        updatedAnswers[question] = answer;
      }

      setAnswers(updatedAnswers);
    },
    [answers, setAnswers],
  );

  const isContinueEnabled = useMemo(() => {
    const condition1 = answers.field1 === "yes";
    const condition2 =
      answers.field1 === "no" && answers.field2 === "yes" && answers.field3 !== undefined;
    const condition3 =
      answers.field1 === "no" && answers.field2 === "no" && answers.field4 !== undefined;

    return condition1 || condition2 || condition3;
  }, [answers]);

  const handleContinue = useCallback(() => {
    let updatedData;

    if (answers.field1 === "yes") {
      updatedData = {
        ...state.onboardingForm,
        membership: "Genetic Counselor",
      };
      actions.updateOnboardingForm(updatedData);
      onNext(updatedData);
    } else if (
      answers.field1 === "no" &&
      answers.field2 === "yes" &&
      answers.field3 !== undefined &&
      answers.field3 !== null
    ) {
      updatedData = {
        ...state.onboardingForm,
        membership: "Healthcare Professional",
      };
      actions.updateOnboardingForm(updatedData);
      onNext(updatedData);
    } else if (answers.field3 === "yes") {
      updatedData = {
        ...state.onboardingForm,
        membership: "Healthcare Professional",
      };
      actions.updateOnboardingForm(updatedData);
      onNext(updatedData);
    } else if (answers.field4 === "Student") {
      updatedData = {
        ...state.onboardingForm,
        membership: "Student",
      };
      actions.updateOnboardingForm(updatedData);
      onStudentFlow();
    } else if (answers.field4 === "Associate Member") {
      updatedData = {
        ...state.onboardingForm,
        membership: "Associate Member",
      };
      actions.updateOnboardingForm(updatedData);
      onAssociateFlow();
    }
  }, [answers, actions, state.onboardingForm, onNext, onStudentFlow, onAssociateFlow]);

  const renderQuestions = () => {
    return (
      <>
        {/* Question 1 */}
        <div>
          <p className={styles.subtitle}>{t("questionnaire-q1")}</p>
          <div className={styles.buttonGroup}>
            <Radio
              id="radio-1"
              label={t("yes")}
              checked={answers.field1 === "yes"}
              onChange={() => {
                handleSelection("field1", "yes");
              }}
            />
            <Radio
              id="radio-2"
              label={t("no")}
              checked={answers.field1 === "no"}
              onChange={() => {
                handleSelection("field1", "no");
              }}
            />
          </div>
        </div>

        {/* Show Question 2 only if field1 is "no" */}
        {answers.field1 === "no" && (
          <div>
            <p className={styles.subtitle}>{t("questionnaire-q2")}</p>
            <div className={styles.buttonGroup}>
              <Radio
                id="radio-3"
                label={t("yes")}
                checked={answers.field2 === "yes"}
                onChange={() => {
                  handleSelection("field2", "yes");
                }}
              />
              <Radio
                id="radio-4"
                label={t("no")}
                checked={answers.field2 === "no"}
                onChange={() => {
                  handleSelection("field2", "no");
                }}
              />
            </div>
          </div>
        )}

        {/* Show Question 3 only if field2 is "yes" */}
        {answers.field2 === "yes" && (
          <div>
            <p className={styles.subtitle}>{t("questionnaire-q3")}</p>
            <div className={styles.buttonGroup}>
              <Radio
                id="radio-5"
                label={t("yes")}
                checked={answers.field3 === "yes"}
                onChange={() => {
                  handleSelection("field3", "yes");
                }}
              />
              <Radio
                id="radio-6"
                label={t("no")}
                checked={answers.field3 === "no"}
                onChange={() => {
                  handleSelection("field3", "no");
                }}
              />
            </div>
          </div>
        )}

        {/* Show Question 4 only if field2 is "no" */}
        {answers.field2 === "no" && (
          <div>
            <p className={styles.subtitle}>{t("questionnaire-q4")}</p>

            <div className={styles.radioGroup}>
              <Radio
                id="radio-7"
                label={t("membership-student")}
                checked={answers.field4 === "Student"}
                onChange={() => {
                  handleSelection("field4", "Student");
                }}
              />
              <div className={styles.expandableIndent}>
                <ExpandableSection
                  title={t("membership-student-title")}
                  content={t("membership-student-desc")}
                />
              </div>

              <Radio
                id="radio-8"
                label={t("membership-associate")}
                checked={answers.field4 === "Associate Member"}
                onChange={() => {
                  handleSelection("field4", "Associate Member");
                }}
              />
              <div className={styles.expandableIndent}>
                <ExpandableSection
                  title={t("membership-associate-title")}
                  content={t("membership-associate-desc")}
                />
              </div>
            </div>
          </div>
        )}
      </>
    );
  };

  return (
    <div className={styles.container}>
      <form className={styles.form}>
        <div>
          <h2 className={styles.title}>{t("questionnaire-title")}</h2>
        </div>

        {renderQuestions()}

        <div className={styles.buttonContainer}>
          <button type="button" onClick={onBack} className={styles.backButton}>
            <Image src="/icons/ic_caretleft.svg" alt="Back Icon" width={24} height={24} />
            {t("back")}
          </button>
          <Button
            type="button"
            onClick={handleContinue}
            label={t("continue")}
            disabled={!isContinueEnabled}
          />
        </div>
      </form>
    </div>
  );
};
