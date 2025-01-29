/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { useStateMachine } from "little-state-machine";

import updateAction from "../../state/updateAction";

const Result = () => {
  const { state } = useStateMachine({ actions: { updateAction } });
  console.log(state.data);

  return (
    <div>
      <h2>Review Your Information</h2>
      <pre>{JSON.stringify(state.data, null, 2)}</pre>
    </div>
  );
};

export default Result;
