"use client"; // Add the use client flag to avoid Server Error

import { useTranslation } from "react-i18next"; // Import this in your component

export const External = () => {
  const { t } = useTranslation(); // define the t function at the top of your component

  // Wrap the key value from the translations/[en, es, pt] files with the t function
  // Paste the corresponsing translated text in each json file, using the same english key for corresponding texts

  //"greeting": "Hello, <strong>{{name}}</strong>! Welcome back."
  // i18next.t('key', { what: 'i18next', how: 'great' });
  //<Trans i18nKey="greeting" values={{ name }}components={{ bold: <strong /> }}/> for html trans inport from react-i18next
  return <div className="relative inline-block text-left">{t("welcome")}</div>;
};
