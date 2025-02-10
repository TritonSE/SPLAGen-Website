"use client";
import { useForm } from "react-hook-form";

import { State } from "../../state/stateTypes";

type Step3BProps = {
  onNext: (data: State["data"]) => void;
  onBack: () => void;
};

const Step3B = ({ onNext, onBack }: Step3BProps) => {
  const { handleSubmit } = useForm<State["data"]>();

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        void handleSubmit(onNext)();
      }}
    >
      <h2>Step 3B - You chose NO</h2>
      <button type="button" onClick={onBack} className="mr-2">
        Back
      </button>
      <button type="submit">Submit</button>
    </form>
  );
};

export default Step3B;
