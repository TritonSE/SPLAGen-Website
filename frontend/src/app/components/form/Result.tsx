"use client";

/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import { useStateMachine } from "little-state-machine";
import { useRouter } from "next/navigation";

import updateAction from "../../state/updateAction";

const Result = () => {
  const { state } = useStateMachine({ actions: { updateAction } });
  const router = useRouter();

  const goBack = () => {
    router.push("/");
  };

  return (
    <div>
      <h2>Review Your Information</h2>
      <pre>{JSON.stringify(state.data, null, 2)}</pre>
      <button onClick={goBack}>Back</button>
    </div>
  );
};

export default Result;
