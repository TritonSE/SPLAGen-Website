"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

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

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    void handleSubmit(onSubmit)();
  };

  const onSubmit = (data: FormData) => {
    console.log("Signed Up!", data);
    alert("Signed Up!");
  };

  return (
    <div
      style={{
        justifyContent: "center",
        alignItems: "center",
        display: "flex",
        width: "1110px",
        height: "942px",
        padding: "65px 278px",
        flexShrink: 0,
        backgroundColor: "white",
        borderRadius: "10px",
        border: "10px solid #3B3B62;",
      }}
    >
      <div
        style={{
          marginTop: "125px",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          alignSelf: "stretch",
          width: "521px",
          padding: "65px",
          borderRadius: "10px",
          backgroundColor: "white",
        }}
      >
        <h1
          className="text-2xl font-bold text-left text-primary mb-2"
          style={{ width: "323px", height: "42px" }}
        >
          Get started
        </h1>
        <p
          className="text-left text-gray-600 mb-2"
          style={{ marginTop: "-20px", width: "323px", height: "27px" }}
        >
          Welcome to SPAGen
        </p>
        <form onSubmit={handleFormSubmit} className="w-full">
          <div className="mb-4 flex space-x-4 w-full">
            {/* First Name Input */}
            <div className="w-1/2">
              <label className="block text-sm font-medium mb-1 text-black">First Name</label>
              <input
                {...register("firstName")}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 placeholder-disabled"
                placeholder="Enter your first name"
              />
              {errors.firstName && (
                <p className="text-red-500 text-xs mt-1">{errors.firstName.message}</p>
              )}
            </div>

            {/* Last Name Input */}
            <div className="w-1/2">
              <label className="block text-sm font-medium mb-1 text-black">Last Name</label>
              <input
                {...register("lastName")}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 placeholder-disabled"
                placeholder="Enter your last name"
              />
              {errors.lastName && (
                <p className="text-red-500 text-xs mt-1">{errors.lastName.message}</p>
              )}
            </div>
          </div>

          {/* Email Input */}
          <div className="mb-4 w-full">
            <label className="block text-sm font-medium mb-1 text-black">Enter your email</label>
            <input
              type="email"
              {...register("email")}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 placeholder-disabled"
              placeholder="Enter your email"
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
          </div>

          {/* Create a Password */}
          <div className="mb-4 w-full">
            <label className="block text-sm font-medium mb-1 text-black">Create a Password</label>
            <input
              type="password"
              {...register("password")}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 placeholder-disabled"
              placeholder="Create a password"
            />
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
            )}
          </div>

          <div className="flex justify-end w-full">
            <button
              type="submit"
              disabled={!isValid}
              className={`w-30 p-2 rounded-lg font-bold text-white mt-4 ${
                isValid ? "bg-primary hover:bg-primary-dark" : "bg-gray-300 cursor-not-allowed"
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
