import * as i18n from "i18next";
import { initReactI18next } from "react-i18next";

import en from "./translations/en.json";
import es from "./translations/es.json";
import pt from "./translations/pt.json";

void i18n.use(initReactI18next).init({
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
});

export default i18n;
