"use client";

import { useStateMachine } from "little-state-machine";

import { State } from "../../state/stateTypes";
import updateAction from "../../state/updateAction";

type Step2Props = {
  onNext: (data: State["data"]) => void;
  onBack: () => void;
};

const Step2 = ({ onNext, onBack }: Step2Props) => {
  const { state, actions } = useStateMachine({ actions: { updateAction } });

  const handleSelection = (answer: "yes" | "no") => {
    const updatedData = { ...state.data, field1: answer };
    actions.updateAction(updatedData);
    onNext(updatedData);
  };

  return (
    <div className="space-y-4">
      <h2>Step 2 - Select Yes or No</h2>
      <div className="space-y-2">
        <label className="block">Do you want to proceed?</label>
        <div className="flex gap-4">
          <button
            type="button"
            className="px-4 py-2 rounded"
            onClick={() => {
              handleSelection("yes");
            }}
          >
            Yes
          </button>
          <button
            type="button"
            className="px-4 py-2 rounded"
            onClick={() => {
              handleSelection("no");
            }}
          >
            No
          </button>
        </div>
      </div>

      <div className="flex justify-between">
        <button type="button" onClick={onBack} className="px-4 py-2 bg-gray-500 text-white rounded">
          Back
        </button>
      </div>
    </div>
  );
};

export default Step2;
