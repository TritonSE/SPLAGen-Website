/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { useStateMachine } from "little-state-machine";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import updateAction from "../../state/updateAction";

type FormData = {
  professionalTitle: string;
  country: string;
}

const Step1 = () => {
  const { register, handleSubmit } = useForm<FormData>();
  const { actions, state } = useStateMachine({actions: { updateAction }});
  const navigate = useNavigate();

  const onSubmit = (data: FormData) => {
    actions.updateAction(data);  // TypeScript now knows that updateAction is a valid function
    navigate("/result"); // Move to next step
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <label>Professional Title</label>
      <input {...register("professionalTitle")} defaultValue={state.data.professionalTitle} />

      <label>Country</label>
      <input {...register("country")} defaultValue={state.data.country} />

      <button type="submit">Next</button>
    </form>
  );
};

export default Step1;