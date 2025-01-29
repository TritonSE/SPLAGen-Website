/* eslint-disable @typescript-eslint/no-misused-promises */

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
    actions.updateAction(data);
    void navigate("/result");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <label>Professional Title</label>
      <input {...register("professionalTitle")} defaultValue={state.data.professionalTitle} />

      <label>Country</label>
      <input {...register("country")} defaultValue={state.data.country} />

      <div><button type="submit">Next</button></div>
    </form>
  );
};

export default Step1;