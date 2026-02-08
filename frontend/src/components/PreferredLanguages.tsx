import { useTranslation } from "react-i18next";

type PreferredLanguagesProps = {
  language?: "english" | "spanish" | "portuguese" | "other";
  languages?: ("english" | "spanish" | "portuguese" | "other")[];
};

export const PreferredLanguages = ({ language, languages }: PreferredLanguagesProps) => {
  const { t } = useTranslation();

  // Handle single language (professional preferred language)
  if (language) {
    return <p>{t(language)}</p>;
  }

  // Handle array of languages (directory display languages)
  if (languages && languages.length > 0) {
    return <p>{languages.map((lang) => t(lang)).join(", ")}</p>;
  }

  return <>{t("none")}</>;
};
