"use client";

import React, { useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import Select, { SingleValue } from "react-select";
import countryList from "react-select-country-list";

export type CountryOption = {
  value: string;
  label: string;
};

type CountrySelectorProps = {
  value: CountryOption | null;
  onChange: (selectedOption: SingleValue<CountryOption>) => void;
  placeholder?: string;
};

export const getCountryOptions = () => {
  const data = (countryList() as { getData: () => CountryOption[] }).getData();
  return data.map((country) => ({
    value: country.value,
    label: country.label,
  }));
};

export const getCountryLabelFromCode = (code: string | undefined): string | undefined => {
  if (!code) return undefined;
  const options = getCountryOptions();
  return options.find((option) => option.value === code)?.label;
};

export const CountrySelector: React.FC<CountrySelectorProps> = ({
  value,
  onChange,
  placeholder,
}) => {
  const { t } = useTranslation();
  // Ensure safe data fetching
  const options = useMemo(() => {
    try {
      return getCountryOptions();
    } catch (err: unknown) {
      console.error(
        "Error fetching country list:",
        err instanceof Error ? err.message : "Unknown error",
      );
      return [];
    }
  }, []);

  const changeHandler = useCallback(
    (selectedOption: SingleValue<CountryOption>) => {
      onChange(selectedOption ?? null);
    },
    [onChange],
  );

  return (
    <div style={{ width: "100%" }}>
      <Select
        instanceId="country-selector"
        options={options}
        value={value}
        onChange={changeHandler}
        placeholder={placeholder ?? t("select-a-country")}
      />
    </div>
  );
};
