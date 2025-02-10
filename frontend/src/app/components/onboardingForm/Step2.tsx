"use client";

import { useStateMachine } from "little-state-machine";
import { useForm } from "react-hook-form";

import { State } from "../../state/stateTypes";
import updateAction from "../../state/updateAction";


type Step2Props = {
  onNext: (data: State["data"]) => void;
  onBack: () => void;
};

const Step2 = ({ onNext, onBack }: Step2Props) => {
  const { state, actions } = useStateMachine({ actions: { updateAction } });
  const { register, handleSubmit } = useForm<State["data"]>({
    defaultValues: state.data,
  });

  const onSubmit = (data: State["data"]) => {
    actions.updateAction(data);
    onNext(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <label className="block">Field1</label>
        <input
          {...register("field1")}
          className="w-full p-2 border rounded"
        />
      </div>

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

export default Step2;