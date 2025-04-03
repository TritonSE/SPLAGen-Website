"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { isValidPhoneNumber } from "react-phone-number-input";
import { z } from "zod";

import { PhoneInput } from "@/components/PhoneInput";

const PhoneSchema = z.object({
  phone: z.string().refine(isValidPhoneNumber, { message: "Invalid phone number" }),
});

const PhoneDemo: React.FC = () => {
  const {
    handleSubmit,
    formState: { errors },
    control,
  } = useForm({
    resolver: zodResolver(PhoneSchema),
    defaultValues: {
      phone: "",
    },
  });

  const onSubmit: SubmitHandler<z.infer<typeof PhoneSchema>> = useCallback((data) => {
    console.log(data);
  }, []);

  const handleFormSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      void handleSubmit(onSubmit)();
    },
    [handleSubmit, onSubmit],
  );
  return (
    <div>
      <h1> Phone Demo </h1>
      <form onSubmit={handleFormSubmit}>
        <div className="flex justify-center items-center h-full flex-col">
          <label htmlFor="phone">Phone Number</label>
          <Controller
            control={control}
            name="phone"
            render={({ field }) => (
              <PhoneInput
                id="phone"
                {...field}
                placeholder="Phone Number"
                international
                defaultCountry="US"
              />
            )}
          />
          {errors.phone && <span>{errors.phone.message}</span>}
          <div>
            <button type="submit">Submit</button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default PhoneDemo;
