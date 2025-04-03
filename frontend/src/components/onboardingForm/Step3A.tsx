"use client";
import { useCallback } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

import { onboardingState } from "@/state/stateTypes";

type Step3AProps = {
  onNext: (data: onboardingState["data"]) => void;
  onBack: () => void;
};

export const Step3A = ({ onNext, onBack }: Step3AProps) => {
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
    [handleSubmit, onSubmit],
  );

  return (
    <form onSubmit={handleFormSubmit} className="space-y-4">
      <h2>Step 3A - You chose YES</h2>

      <div className="flex justify-between">
        <button type="button" onClick={onBack} className="px-4 py-2 bg-gray-500 text-white rounded">
          Back
        </button>
        <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">
          Submit
        </button>
      </div>
    </form>
  );
};
