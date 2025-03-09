"use client"; // Add the use client flag to avoid Server Error

import { useTranslation } from "react-i18next"; // Import this in your component

export const External = () => {
  const { t } = useTranslation(); // define the t function at the top of your component

  // Wrap the key value from the translations/[en, es, pt] files with the t function
  // Paste the corresponsing translated text in each json file, using the same english key for corresponding texts
  return <div className="relative inline-block text-left">{t("welcome")}</div>;
};
