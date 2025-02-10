"use client";

import { useStateMachine } from "little-state-machine";
import { useState } from "react";

import { State } from "../../state/stateTypes";
import updateAction from "../../state/updateAction";

import Result from "./Result";
import Step1 from "./Step1";
import Step2 from "./Step2";
import Step3A from "./Step3A";
import Step3B from "./Step3B";

const FormWrapper = () => {
  const [step, setStep] = useState(1);
  const { actions } = useStateMachine({ actions: { updateAction } });

  const handleNext = (data: State["data"]) => {
    actions.updateAction(data);
    if (step === 2) {
      if (data.field1 === "yes") {
        setStep(3); // Go to Step3A
      } else {
        setStep(4); // Go to Step3B
      }
    } else if (step === 3) {
      setStep(step + 2);
    } else {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    setStep((prev) => Math.max(1, prev - 1)); // back out of conditional check
  };

  const handleReset = () => {
    actions.updateAction({
      professionalTitle: "",
      country: "",
      field1: "",
    });
    setStep(1);
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-md rounded">
      {step === 1 && <Step1 onNext={handleNext} />}
      {step === 2 && <Step2 onNext={handleNext} onBack={handleBack} />}
      {step === 3 && (
        <Step3A
          onNext={handleNext}
          onBack={() => {
            setStep(2);
          }}
        />
      )}
      {step === 4 && (
        <Step3B
          onNext={handleNext}
          onBack={() => {
            setStep(2);
          }}
        />
      )}
      {step === 5 && <Result onReset={handleReset} />}
    </div>
  );
};

export default FormWrapper;
