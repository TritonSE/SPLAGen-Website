"use client";

import styles from "./languageSwitcher.module.css";

import i18n from "@/i18n";

export const LanguageSwitcher = () => {
  const changeLanguage = async (lng: string) => {
    try {
      await i18n.changeLanguage(lng);
      localStorage.setItem("i18nextLng", lng);
    } catch (error) {
      console.error("Failed to change language:", error);
    }
  };

  return (
    <div className={styles.buttonContainer}>
      <button className={styles.button} onClick={() => void changeLanguage("en")}>
        {"English"}
      </button>
      <button className={styles.button} onClick={() => void changeLanguage("es")}>
        {"Español"}
      </button>
      <button className={styles.button} onClick={() => void changeLanguage("pt")}>
        {"Português"}
      </button>
    </div>
  );
};
