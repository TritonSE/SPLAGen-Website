"use client";

import { useStateMachine } from "little-state-machine";
import { useState } from "react";

import { State } from "../../state/stateTypes";
import updateAction from "../../state/updateAction";

import Result from "./Result";
import Step1 from "./Step1";
import Step2 from "./Step2";

const FormWrapper = () => {
  const [step, setStep] = useState(1);
  const { actions } = useStateMachine({ actions: { updateAction } });

  const handleNext = (data: State["data"]) => {
    actions.updateAction(data);
    setStep(step + 1);
  };

  const handleBack = () => {
    setStep((prev) => Math.max(1, prev - 1));
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
      {step === 3 && <Result onReset={handleReset}/>}
    </div>
  );
};

export default FormWrapper;