"use client";
import { Radio } from "@tritonse/tse-constellation";
import { useStateMachine } from "little-state-machine";
import { useCallback, useState } from "react";

import styles from "./Step2.module.css";

import { ExpandableSection } from "@/components";
import { onboardingState } from "@/state/stateTypes";
import updateOnboardingForm from "@/state/updateOnboardingForm";

type Step2Props = {
  onNext: (data: onboardingState["data"]) => void;
  onBack: () => void;
  onStudentFlow: () => void;
  onAssociateFlow: () => void;
};

export const Step2: React.FC<Step2Props> = ({ onNext, onBack, onStudentFlow, onAssociateFlow }) => {
  const { state, actions } = useStateMachine({ actions: { updateOnboardingForm } });
  const [answers, setAnswers] = useState<Record<string, string>>({}); // To store all question answers

  // Handle selection for each question
  const handleSelection = useCallback(
    (question: string, answer: string) => {
      let updatedAnswers = { ...answers };
  
      // Reset dependent fields when an earlier question changes
      if (question === "field1") {
        updatedAnswers = { field1: answer }; // Reset everything except field1
      } else if (question === "field2") {
        updatedAnswers = { ...answers, field2: answer }; // Reset field3 and field4
        delete updatedAnswers.field3;
        delete updatedAnswers.field4;
      } else if (question === "field3") {
        updatedAnswers = { ...answers, field3: answer }; // Reset field4
        delete updatedAnswers.field4;
      } else {
        updatedAnswers[question] = answer; // Normal update
      }
  
      setAnswers(updatedAnswers);
  
      if (question === "field1" && answer === "yes") {
        const updatedData = {
          ...state.onboardingForm,
          membership: "Healthcare Professional"
        };
        actions.updateOnboardingForm(updatedData);
        onNext(updatedData);
      }
      
      // If the third question is answered and is "Yes", trigger onNext
      if (question === "field3") {
        const updatedData = {
          ...state.onboardingForm,
          membership: "Healthcare Professional"
        };
        actions.updateOnboardingForm(updatedData);
        onNext(updatedData);
      }
      
      // If they select Student, go to Student flow
      if (question === "field4" && answer === "Student") {
        const updatedData = {
          ...state.onboardingForm,
          membership: "Student"
        };
        actions.updateOnboardingForm(updatedData);
        onStudentFlow();
      }
      
      // If they select Associate Member, go to Associate flow
      if (question === "field4" && answer === "Associate Member") {
        const updatedData = {
          ...state.onboardingForm,
          membership: "Associate Member"
        };
        actions.updateOnboardingForm(updatedData);
        onAssociateFlow();
      }
    },
    [answers, actions, state.onboardingForm, onNext, onStudentFlow, onAssociateFlow]
  );

  // Render the questions dynamically based on the answers
  const renderQuestions = () => {
    return (
      <>
        {/* Question 1 */}
        <div>
          <p className={styles.subtitle}>
          Did you complete your genetic counseling training in an accredited masters program in the United States or a formal genetic counseling program in Latin America (either the Cuban or Brazilian genetic counseling masters programs)?
          </p>
          <div className={styles.buttonGroup}>
            <Radio
              id="radio-1"
              label="Yes"
              checked={answers.field1 === "yes"}
              onChange={() => { handleSelection("field1", "yes"); }}
            />
            <Radio
              id="radio-2"
              label="No"
              checked={answers.field1 === "no"}
              onChange={() => { handleSelection("field1", "no"); }}
            />
          </div>
        </div>
  
        {/* Show Question 2 only if field1 is "no" */}
        {answers.field1 === "no" && (
          <div>
            <p className={styles.subtitle}>
            Do you hold a MD, master&apos;s or PhD in a field such as medicine, nursing, social work, biology, public health?
            </p>
            <div className={styles.buttonGroup}>
              <Radio
                id="radio-3"
                label="Yes"
                checked={answers.field2 === "yes"}
                onChange={() => { handleSelection("field2", "yes"); }}
              />
              <Radio
                id="radio-4"
                label="No"
                checked={answers.field2 === "no"}
                onChange={() => { handleSelection("field2", "no"); }}
              />
            </div>
          </div>
        )}
  
        {/* Show Question 3 only if field2 is "yes" */}
        {answers.field2 === "yes" && (
          <div>
            <p className={styles.subtitle}>
              Have you had at least one year of formal clinical training in genetics (e.g. certificate program)?
            </p>
            <div className={styles.buttonGroup}>
              <Radio
                id="radio-5"
                label="Yes"
                checked={answers.field3 === "yes"}
                onChange={() => { handleSelection("field3", "yes"); }}
              />
              <Radio
                id="radio-6"
                label="No"
                checked={answers.field3 === "no"}
                onChange={() => { handleSelection("field3", "no"); }}
              />
            </div>
          </div>
        )}
  
        {/* Show Question 4 only if field2 is "no" */}
        {answers.field2 === "no" && (
        <div>
          <p className={styles.subtitle}>
          Select the following membership category that best suits you. 
          </p>
          
          <Radio id="radio-7" label="Student" checked={answers.field4 === "Student"} onChange={() => { handleSelection("field4", "Student"); }} />
          <ExpandableSection
            title="Student Membership"
            content="Student membership will be granted to students enrolled in genetic counseling programs offered by an accredited institution, as well as to students enrolled in other degree-granting programs and who are interested in supporting the mission of society. Interested students can submit an application and, upon approval by officials, student membership can be granted or denied. Student members have the privileges of full members; however, they will not be granted a vote on issues or elections open to full and associate members. Student members are not eligible to serve on the Board of Directors or as committee chairs, with the exception of any committee specifically created for students. Student leadership roles will be filled by genetic counseling students."
          />

          <Radio id="radio-8" label="Associate Member" checked={answers.field4 === "Associate Member"} onChange={() => { handleSelection("field4", "Associate Member"); }} />
          <ExpandableSection
            title="Associate Membership"
            content="Associate membership will be granted to all applicants interested in supporting the mission of Splagen and who are not eligible for full or student membership. Interested individuals can submit an application and, upon approval by officials, associated membership can be granted or denied. Associate members have all the privileges of full members, but are not eligible for a position on the Board of Directors and can only vote, hold positions as committee chairs and leadership positions related to their specialty and professional background."
          />
      
        </div>
        
      )}
      </>
    );
  };

  return (
    <div className={styles.container}>
      <form className={styles.form}>
        <div>
          <h2 className={styles.title}>Membership Questionnaire</h2>
        </div>

        {renderQuestions()}

        <div className={styles.navigation}>
          <button type="button" onClick={onBack} className={styles.backButton}>
            Back
          </button>
        </div>
      </form>
    </div>
  );
};
