"use client";

import React, { useCallback } from "react";
import { useTranslation } from "react-i18next";
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
  placeholder,
}) => {
  const { t } = useTranslation();

  // Translate the options for display
  const translatedOptions = professionalTitleOptions.map((option) => ({
    value: option.value,
    label: t(option.label),
  }));

  // Translate the current value if it exists
  const translatedValue = value
    ? {
        value: value.value,
        label: t(value.label),
      }
    : null;

  const changeHandler = useCallback(
    (selectedOption: SingleValue<ProfessionalTitleOption>) => {
      // When user selects an option, find the original untranslated option to pass back
      const originalOption = professionalTitleOptions.find(
        (opt) => opt.value === selectedOption?.value,
      );
      onChange(originalOption ?? null);
    },
    [onChange],
  );

  return (
    <div style={{ width: "100%" }}>
      <Select
        instanceId="professional-title-selector"
        options={translatedOptions}
        value={translatedValue}
        onChange={changeHandler}
        placeholder={placeholder ?? t("select-professional-title")}
      />
    </div>
  );
};
