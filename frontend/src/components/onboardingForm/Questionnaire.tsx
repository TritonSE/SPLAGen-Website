"use client";
import { Radio } from "@tritonse/tse-constellation";
import { useStateMachine } from "little-state-machine";
import { useCallback, useContext, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import styles from "./Questionnaire.module.css";

import { MembershipType, editMembership } from "@/api/users";
import { Button } from "@/components";
import { UserContext } from "@/contexts/userContext";
import { onboardingState } from "@/state/stateTypes";
import updateOnboardingForm from "@/state/updateOnboardingForm";

const DISPLAY_TO_DB_MEMBERSHIP: Record<string, MembershipType> = {
  "Genetic Counselor": "geneticCounselor",
  "Other Genetics Professional": "otherGeneticsProfessional",
  "Healthcare Professional": "healthcareProfessional",
  Student: "student",
  "Associate Member": "associate",
};

type QuestionnaireProps = {
  onNext: (data: onboardingState["data"]) => void;
  onStudentFlow: () => void;
  onAssociateFlow: () => void;
};

export const Questionnaire: React.FC<QuestionnaireProps> = ({
  onNext,
  onStudentFlow,
  onAssociateFlow,
}) => {
  const { t } = useTranslation();
  const { state, actions } = useStateMachine({ actions: { updateOnboardingForm } });
  const { firebaseUser, reloadUser } = useContext(UserContext);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const handleContinue = useCallback(async () => {
    let membershipCategory: string;

    if (answers.field1 === "yes") {
      membershipCategory = "Genetic Counselor";
    } else if (answers.field2 === "yes") {
      if (answers.field3 === "yes") {
        membershipCategory = "Other Genetics Professional";
      } else {
        membershipCategory = "Healthcare Professional";
      }
    } else {
      if (answers.field4 === "yes") {
        membershipCategory = "Student";
      } else {
        membershipCategory = "Associate Member";
      }
    }

    const updatedData = {
      ...state.onboardingForm,
      membership: membershipCategory,
    };
    actions.updateOnboardingForm(updatedData);

    // PATCH the user's membership on the backend before navigating
    if (!firebaseUser) {
      setSubmitError(t("registration-failed"));
      return;
    }
    setSubmitError(null);
    setIsSubmitting(true);

    try {
      const token = await firebaseUser.getIdToken();
      const result = await editMembership(DISPLAY_TO_DB_MEMBERSHIP[membershipCategory], token);
      if (!result.success) {
        setSubmitError(result.error || t("registration-failed"));
        return;
      }
      reloadUser();
    } catch {
      setSubmitError(t("registration-failed"));
      return;
    } finally {
      setIsSubmitting(false);
    }

    if (membershipCategory === "Student") {
      onStudentFlow();
    } else if (membershipCategory === "Associate Member") {
      onAssociateFlow();
    } else {
      onNext(updatedData);
    }
  }, [
    answers,
    actions,
    state.onboardingForm,
    firebaseUser,
    reloadUser,
    onNext,
    onStudentFlow,
    onAssociateFlow,
    t,
  ]);

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
            <div className={styles.buttonGroup}>
              <Radio
                id="radio-7"
                label={t("yes")}
                checked={answers.field4 === "yes"}
                onChange={() => {
                  handleSelection("field4", "yes");
                }}
              />
              <Radio
                id="radio-8"
                label={t("no")}
                checked={answers.field4 === "no"}
                onChange={() => {
                  handleSelection("field4", "no");
                }}
              />
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

        {submitError && <p style={{ color: "red" }}>{submitError}</p>}

        <div className={styles.buttonContainer}>
          <Button
            type="button"
            onClick={() => void handleContinue()}
            label={isSubmitting ? t("loading") : t("continue")}
            disabled={!isContinueEnabled || isSubmitting}
          />
        </div>
      </form>
    </div>
  );
};
