"use client";
import { useCallback } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

import { onboardingState } from "@/state/stateTypes";

type Step3BProps = {
  onNext: (data: onboardingState["data"]) => void;
  onBack: () => void;
};

export const Step3B = ({ onNext, onBack }: Step3BProps) => {
  const { handleSubmit } = useForm<onboardingState["data"]>();

  const onSubmit: SubmitHandler<onboardingState["data"]> = useCallback(
    (data) => {
      onNext(data);
    },
    [onNext],
  );

  const handleFormSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      void handleSubmit(onSubmit)();
    },
    [handleSubmit, onSubmit], // Dependencies
  );

  return (
    <form onSubmit={handleFormSubmit} className="space-y-4">
      <h2>Step 3B - You chose NO</h2>
      <button type="button" onClick={onBack} className="mr-2">
        Back
      </button>
      <button type="submit">Submit</button>
    </form>
  );
};
