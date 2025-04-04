"use client";

import { useStateMachine } from "little-state-machine";
import { useCallback } from "react";
import { useForm } from "react-hook-form";

import { onboardingState } from "@/state/stateTypes";
import updateOnboardingForm from "@/state/updateOnboardingForm";

type Step1Props = {
  onNext: (data: onboardingState["data"]) => void;
};

export const Step1 = ({ onNext }: Step1Props) => {
  const { state, actions } = useStateMachine({ actions: { updateOnboardingForm } });

  const { register, handleSubmit } = useForm<onboardingState["data"]>({
    defaultValues: state.onboardingForm,
  });

  const onSubmit = useCallback(
    (data: onboardingState["data"]) => {
      actions.updateOnboardingForm(data);
      onNext(data);
    },
    [actions, onNext],
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
      <div className="space-y-2">
        <label className="block">Professional Title</label>
        <input {...register("professionalTitle")} className="w-full p-2 border rounded" />
      </div>

      <div className="space-y-2">
        <label className="block">Country</label>
        <input {...register("country")} className="w-full p-2 border rounded" />
      </div>

      <div className="flex justify-end">
        <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">
          Next
        </button>
      </div>
    </form>
  );
};
