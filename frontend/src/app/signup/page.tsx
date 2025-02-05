"use client";

import React, { useState } from "react";

type FormData = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
};

const SignUpPage = () => {
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const [isFormValid, setIsFormValid] = useState(false);

  const validateForm = (data: FormData) => {
    const isValid = Boolean(
      data.firstName && data.lastName && data.email && data.password.length >= 8,
    );
    setIsFormValid(isValid);
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    const updatedFormData = { ...formData, [field]: value };
    setFormData(updatedFormData);
    validateForm(updatedFormData);
  };

  const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    if (isFormValid) {
      alert("Signed Up!");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-100">
      <div className="w-full max-w-md bg-white p-6 rounded-2xl shadow-md">
        {/* Updated text color to #3B3B62 according to Figma*/}
        {/* <h1 className="text-2xl font-bold text-left mb-2 text-mainHeading">Get started</h1> */}
        <h1 className="text-2xl font-bold text-left mb-2" style={{ color: "#3B3B62" }}>
          Get started
        </h1>
        <p className="text-left text-gray-600 mb-6">Welcome to SPAGen</p>
        <form onSubmit={handleSubmit}>
          <div className="mb-4 flex space-x-4">
            {/* First Name Input */}
            <div className="w-1/2">
              <label className="block text-sm font-medium mb-1 text-black">First Name</label>
              <input
                type="text"
                value={formData.firstName}
                onChange={(e) => {
                  handleInputChange("firstName", e.target.value);
                }}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 placeholder-disabled"
                placeholder="Enter your first name"
              />
            </div>

            {/* Last Name Input */}
            <div className="w-1/2">
              <label className="block text-sm font-medium mb-1 text-black">Last Name</label>
              <input
                type="text"
                value={formData.lastName}
                onChange={(e) => {
                  handleInputChange("lastName", e.target.value);
                }}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 placeholder-disabled"
                placeholder="Enter your last name"
              />
            </div>
          </div>

          {/* Email Input */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1 text-black">Enter your email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => {
                handleInputChange("email", e.target.value);
              }}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 placeholder-disabled"
              placeholder="Enter your email"
            />
          </div>

          {/* Create a Password */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1 text-black">Create a Password</label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => {
                handleInputChange("password", e.target.value);
              }}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 placeholder-disabled"
              placeholder="Create a password"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={!isFormValid}
              /* Updated color for the buttons to be the purple button present
              in throughout the app with the same hover effect color
              as shown in Figma*/
              // className={`w-30 p-2 rounded-lg font-bold text-white mt-4 ${
              //   isFormValid ? "bg-blue-500 hover:bg-blue-600" : "bg-gray-300 cursor-not-allowed"
              // }`}
              className={`w-30 p-2 rounded-lg font-bold text-white mt-4 transition-colors ${
                isFormValid
                  ? "bg-[#3B3B62] hover:bg-[#BCBCCF] active:bg-[#3B3B62]"
                  : "bg-[#D8D8D8] cursor-not-allowed"
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
