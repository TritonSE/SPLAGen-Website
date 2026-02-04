"use client";

import { ChevronDown, ChevronUp, Globe } from "lucide-react";
import { useState } from "react";

import styles from "./languageSwitcher.module.css";

import i18n from "@/i18n";

const LANGUAGES = [
  { label: "English", code: "en" },
  { label: "Español", code: "es" },
  { label: "Português", code: "pt" },
];

export const LanguageSwitcher = () => {
  const currentLanguage =
    LANGUAGES.find((language) => language.code === i18n.language) ?? LANGUAGES[0];
  const [showDropdown, setShowDropdown] = useState(false);

  const changeLanguage = async (lng: string) => {
    try {
      await i18n.changeLanguage(lng);
    } catch (error) {
      console.error("Failed to change language:", error);
    }
    setShowDropdown(false);
  };

  return (
    <div className={styles.root}>
      <div
        className={styles.languageDisplay}
        onClick={() => {
          setShowDropdown(!showDropdown);
        }}
      >
        <p>{currentLanguage.label}</p>
        <Globe />
        {showDropdown ? <ChevronUp /> : <ChevronDown />}
      </div>

      {showDropdown && (
        <div className={styles.languagesContainer}>
          {LANGUAGES.map((language) => (
            <button
              key={language.code}
              className={styles.button}
              onClick={() => void changeLanguage(language.code)}
            >
              {language.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
