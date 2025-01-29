import { useStateMachine } from "little-state-machine";
import { useNavigate } from "react-router-dom";

import updateAction from "../../state/updateAction";

const Result = () => {
  const { state } = useStateMachine({ actions: { updateAction } });
  const navigate = useNavigate();

  const goBack = () => {
    void navigate("/");
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
