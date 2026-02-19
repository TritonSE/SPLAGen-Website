import styles from "./styles.module.css";

import { CurrentUser } from "@/components/CurrentUser";
import { LanguageSwitcher } from "@/components/languageSwitcher";

type TopNavbarProps = {
  languageVisible: boolean;
  currentUserVisible: boolean;
};

export const TopNavbar = ({ languageVisible, currentUserVisible }: TopNavbarProps) => {
  return (
    <div className={styles.root}>
      {languageVisible ? <LanguageSwitcher /> : null}
      {currentUserVisible ? <CurrentUser /> : null}
    </div>
  );
};
