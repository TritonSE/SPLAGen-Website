"use client";

import { useStateMachine } from "little-state-machine";

import updateAction from "../../state/updateAction";

type ResultProps = {
  onReset: () => void;
};

const Result = ({ onReset }: ResultProps) => {
  const { state } = useStateMachine({ actions: { updateAction } });

  return (
    <div>
      <h2 className="text-xl font-bold">Form Submission Result</h2>
      <p>
        <strong>Professional Title:</strong> {state.data.professionalTitle}
      </p>
      <p>
        <strong>Country:</strong> {state.data.country}
      </p>
      <p>
        <strong>Field1:</strong> {state.data.field1}
      </p>
      <button onClick={onReset}>Back</button>
    </div>
  );
};

export default Result;
