/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
// src/components/form/Step1.tsx
// src/app/form/page.tsx
"use client";

import { useState } from "react";
import { useStateMachine } from "little-state-machine";

import Step1 from "../form/Step1";
import Step2 from "../form/Step2";
// import Step3 from "../components/form/Step3";
import Result from "../form/Result";
// import ProgressBar from "../components/form/ProgressBar";
import updateAction from "../.././state/updateAction";

export default function FormPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const { state, actions } = useStateMachine({ actions: {updateAction} });

  const nextStep = () => {
    actions.updateAction(state.data);
    setCurrentStep(prev => prev + 1);
  };

  // const previousStep = () => {
  //   setCurrentStep(prev => prev - 1);
  // };

  // Conditional rendering logic
  const renderStep = () => {
    // Example of conditional rendering based on state
    switch(currentStep) {
      case 1:
        return <Step1 onNext={nextStep} />;
      case 2:
        // Example of conditional rendering based on previous answers
        // if (state.data.country === "USA") {
        //   return <Step2 onNext={nextStep} />;
        // } else {
        //   return <Step3 onNext={nextStep} onBack={previousStep} />;
        // }
        return <Step2 onNext={nextStep} />;
      case 3:
        return <Result />;
      // case 4:
      //   return <Result data={state.data} onBack={previousStep} />;
      default:
        return <Step1 onNext={nextStep} />;
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      {/* <ProgressBar currentStep={currentStep} totalSteps={4} /> */}
      {renderStep()}
    </div>
  );
}