"use client";

import React, { useMemo, useState } from "react";
import Select, { SingleValue } from "react-select";
import countryList from "react-select-country-list";

type CountryOption = {
  value: string;
  label: string;
};

export const CountrySelector: React.FC = () => {
  const [value, setValue] = useState<CountryOption | null>(null);

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

  const changeHandler = (selectedOption: SingleValue<CountryOption>) => {
    setValue(selectedOption ?? null);
  };

  return (
    <div>
      <Select
        options={options}
        value={value}
        onChange={changeHandler}
        placeholder="Select a country..."
      />
      {value && <p>Selected country: {value.label}</p>}
    </div>
  );
};
