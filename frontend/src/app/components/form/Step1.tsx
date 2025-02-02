/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
"use client";

import { useStateMachine } from "little-state-machine";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

import updateAction from "../../state/updateAction";

type FormData = {
  professionalTitle: string;
  country: string;
}

const Step1 = () => {
  const { register, handleSubmit } = useForm<FormData>();
  const { actions } = useStateMachine({ actions: { updateAction }});
  const router = useRouter();

  const onSubmit = (data: FormData) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    actions.updateAction(data);
    router.push("/components/form/result");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <label>Professional Title</label>
      <input {...register("professionalTitle")} defaultValue={""} />

      <label>Country</label>
      <input {...register("country")} defaultValue={""} />

      <div><button type="submit">Next</button></div>
    </form>
  );
};

export default Step1;