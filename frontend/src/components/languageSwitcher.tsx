"use client";

import i18n from "../i18n";

import styles from "./languageSwitcher.module.css";

const LanguageSwitcher = () => {
  const changeLanguage = async (lng: string) => {
    try {
      await i18n.changeLanguage(lng);
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

export default LanguageSwitcher;
