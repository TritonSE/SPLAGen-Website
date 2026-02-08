import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";

import en from "./translations/en.json";
import es from "./translations/es.json";
import pt from "./translations/pt.json";

const detectionOptions = {
  order: ["path", "cookie", "localStorage", "navigator"],
  lookupFromPathIndex: 1, // For directory map: /directoryMap/{en,es,pt}
};

// eslint-disable-next-line import/no-named-as-default-member
void i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      es: { translation: es },
      pt: { translation: pt },
    },
    fallbackLng: "en",
    supportedLngs: ["en", "es", "pt"],
    interpolation: {
      escapeValue: false,
    },
    detection: detectionOptions,
  });

export default i18n;
