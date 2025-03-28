import { Step } from "./Step";
import styles from "./VerticalStepper.module.css";

export type OnboardingStep = 0 | 1 | 2;

type VerticalStepperProps = {
  steps: string[];
  activeStep: OnboardingStep | 3;
};

export const VerticalStepper: React.FC<VerticalStepperProps> = ({ steps, activeStep }) => {
  // Ensure activeStep is within bounds
  const validActiveStep = activeStep;

  return (
    <div className={styles.stepperContainer}>
      {steps.map((step, index) => {
        let caseType: "done" | "current" | "pending";

        if (index < validActiveStep) {
          caseType = "done";
        } else if (index === validActiveStep) {
          caseType = "current";
        } else {
          caseType = "pending";
        }

        return (
          <Step
            key={index}
            step={step}
            index={index}
            caseType={caseType}
            isLast={index === steps.length - 1}
          />
        );
      })}
    </div>
  );
};
