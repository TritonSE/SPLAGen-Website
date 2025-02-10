"use client";
import { SubmitHandler, useForm } from "react-hook-form";

import { State } from "../../state/stateTypes";

type Step3AProps = {
  onNext: (data: State["data"]) => void;
  onBack: () => void;
};

const Step3A = ({ onNext, onBack }: Step3AProps) => {
  const { handleSubmit } = useForm<State["data"]>();

  const onSubmit: SubmitHandler<State["data"]> = (data) => {
    onNext(data);
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        void handleSubmit(onSubmit)();
      }}
      className="space-y-4"
    >
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

export default Step3A;
