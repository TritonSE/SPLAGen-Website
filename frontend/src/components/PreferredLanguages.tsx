import { useTranslation } from "react-i18next";

type PreferredLanguagesProps = {
  languages: ("english" | "spanish" | "portuguese" | "other")[] | undefined;
};

export const PreferredLanguages = ({ languages }: PreferredLanguagesProps) => {
  const { t } = useTranslation();

  if (!languages || languages.length === 0) return <>{t("none")}</>;

  return (
    <ul>
      {languages.map((lang, idx) => (
        <li key={idx}>{t(lang)}</li>
      ))}
    </ul>
  );
};
