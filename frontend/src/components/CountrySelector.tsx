"use client";

import React, { useCallback, useMemo } from "react";
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

export const CountrySelector: React.FC<CountrySelectorProps> = ({
  value,
  onChange,
  placeholder = "Select a country...",
}) => {
  // Ensure safe data fetching
  const options = useMemo(() => {
    try {
      const data = (countryList() as { getData: () => CountryOption[] }).getData();
      return data.map((country) => ({
        value: country.value,
        label: country.label,
      }));
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
        placeholder={placeholder}
      />
    </div>
  );
};
