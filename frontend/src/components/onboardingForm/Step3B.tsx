"use client";

import React from "react";

type Step3AProps = {
  onNext: () => void;
  onBack: () => void;
};

export const Step3B: React.FC<Step3AProps> = ({ onNext, onBack }) => {

  const handleContinue = () => {
    onNext();
  };

  return (
    <div className="space-y-4">
      <h2>Welcome to SPLAGen!</h2>

      <p>{"You are being added to SPLAGEN's full membership as a Student."}</p>

      <div className="flex justify-between">
        <button type="button" onClick={onBack} className="px-4 py-2 bg-gray-500 text-white rounded">
          Back
        </button>
        <button type="button" onClick={handleContinue} className="px-4 py-2 bg-blue-500 text-white rounded">
          Continue
        </button>
      </div>
    </div>
  );
};
