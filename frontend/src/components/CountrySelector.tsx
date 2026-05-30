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

// Cache localized country lists so we don't rebuild them on every render
const optionsCache = new Map<string, CountryOption[]>();

export const getCountryOptions = (locale = "en"): CountryOption[] => {
  const cached = optionsCache.get(locale);
  if (cached) return cached;

  const data = (countryList() as { getData: () => CountryOption[] }).getData();

  let displayNames: Intl.DisplayNames | null = null;
  try {
    displayNames = new Intl.DisplayNames([locale], { type: "region" });
  } catch {
    displayNames = null;
  }

  const localized = data
    .map((country) => ({
      value: country.value,
      label: displayNames?.of(country.value) ?? country.label,
    }))
    .sort((a, b) => a.label.localeCompare(b.label, locale));

  optionsCache.set(locale, localized);
  return localized;
};

export const getCountryLabelFromCode = (
  code: string | undefined,
  locale = "en",
): string | undefined => {
  if (!code) return undefined;
  return getCountryOptions(locale).find((option) => option.value === code)?.label;
};

export const CountrySelector: React.FC<CountrySelectorProps> = ({
  value,
  onChange,
  placeholder,
}) => {
  const { t, i18n } = useTranslation();
  // Ensure safe data fetching
  const options = useMemo(() => {
    try {
      return getCountryOptions(i18n.language);
    } catch (err: unknown) {
      console.error(
        "Error fetching country list:",
        err instanceof Error ? err.message : "Unknown error",
      );
      return [];
    }
  }, [i18n.language]);

  // Re-map the selected value's label into the current locale so the
  // displayed country name updates when the user changes languages.
  const localizedValue = useMemo(() => {
    if (!value) return null;
    return options.find((opt) => opt.value === value.value) ?? value;
  }, [value, options]);

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
        value={localizedValue}
        onChange={changeHandler}
        placeholder={placeholder ?? t("select-a-country")}
      />
    </div>
  );
};
