"use client";

import React, { useCallback } from "react";
import Select, { SingleValue } from "react-select";

import { professionalTitleOptions } from "@/api/users";

export type ProfessionalTitleOption = {
  value: string;
  label: string;
};

type ProfessionalTitleSelectorProps = {
  value: ProfessionalTitleOption | null;
  onChange: (selectedOption: SingleValue<ProfessionalTitleOption>) => void;
  placeholder?: string;
};

export const ProfessionalTitleSelector: React.FC<ProfessionalTitleSelectorProps> = ({
  value,
  onChange,
  placeholder = "Select your professional title...",
}) => {
  const changeHandler = useCallback(
    (selectedOption: SingleValue<ProfessionalTitleOption>) => {
      onChange(selectedOption ?? null);
    },
    [onChange],
  );

  return (
    <div style={{ width: "100%" }}>
      <Select
        instanceId="professional-title-selector"
        options={professionalTitleOptions}
        value={value}
        onChange={changeHandler}
        placeholder={placeholder}
      />
    </div>
  );
};
