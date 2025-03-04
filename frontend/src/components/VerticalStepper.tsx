import { Step } from "./Step";
import styles from "./VerticalStepper.module.css";

type VerticalStepperProps = {
  steps: string[];
  activeStep: number;
};

export const VerticalStepper: React.FC<VerticalStepperProps> = ({ steps, activeStep }) => {
  // Ensure activeStep is within bounds
  const validActiveStep = Math.max(0, Math.min(activeStep, steps.length - 1));

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
