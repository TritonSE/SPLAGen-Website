"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import React, { useCallback } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import style from "./SignUp.module.css";

const formSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/\d/, "Password must contain at least one number")
    .regex(/[!@#$%^&*(),.?":{}|<>]/, "Password must contain at least one special character"),
});

type FormData = z.infer<typeof formSchema>;

const SignUpPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
  });

  const onSubmit = useCallback((data: FormData) => {
    console.log("Signed Up!", data);
    alert("Signed Up!");
  }, []);

  const handleFormSubmit = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      void handleSubmit(onSubmit)();
    },
    [handleSubmit, onSubmit],
  );

  return (
    <div className={style.signup}>
      <div>
        <h1 className={` text-2xl font-bold text-left text-primary mb-2 ${style.signupTitle}`}>
          Get started
        </h1>
        <p className={`text-left text-gray-600 mb-6  ${style.signupWelcome}`}>Welcome to SPAGen</p>
        <form onSubmit={handleFormSubmit} className="w-full">
          <div className={style.signupNames}>
            {/* First Name Input */}
            <div className="">
              <label className="block text-sm font-medium mb-1 text-black" htmlFor="firstName">
                First Name
              </label>
              <input
                {...register("firstName")}
                className="p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 placeholder-disabled"
                placeholder="Enter your first name"
                id="firstName"
              />
              <p className="text-red-500 text-xs mt-1">
                {errors.firstName ? errors.firstName.message : "\u00A0"}
              </p>
            </div>

            {/* Last Name Input */}
            <div className="">
              <label className="block text-sm font-medium mb-1 text-black" htmlFor="lastName">
                Last Name
              </label>
              <input
                {...register("lastName")}
                className="p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 placeholder-disabled"
                placeholder="Enter your last name"
                id="lastName"
              />

              <p className="text-red-500 text-xs mt-1">
                {errors.lastName ? errors.lastName.message : "\u00A0"}
              </p>
            </div>
          </div>

          {/* Email Input */}
          <div>
            <label className="block text-sm font-medium mb-1 text-black" htmlFor="email">
              Enter your email
            </label>
            <input
              type="email"
              {...register("email")}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 placeholder-disabled"
              placeholder="Enter your email"
              autoComplete="email"
              id="email"
            />
            <p className="text-red-500 text-xs mt-1">
              {errors.email ? errors.email.message : "\u00A0"}
            </p>
          </div>

          {/* Create a Password */}
          <div className="mb-4 w-full">
            <label className="block text-sm font-medium mb-1 text-black" htmlFor="password">
              Create a Password
            </label>
            <input
              type="password"
              {...register("password")}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 placeholder-disabled"
              placeholder="Create a password"
              id="password"
            />

            <p className="text-red-500 text-xs mt-1">
              {errors.password ? errors.password.message : "\u00A0"}
            </p>
          </div>

          <div className="flex justify-end w-full">
            <button
              type="submit"
              disabled={!isValid}
              className={`w-30 py-2 px-4 rounded-lg font-bold text-white mt-4 hover:bg-[#BCBCCF] ${
                isValid
                  ? "bg-primary hover:bg-primary-dark"
                  : "bg-disabled cursor-not-allowed pointer-events-none"
              }`}
            >
              Continue
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignUpPage;
