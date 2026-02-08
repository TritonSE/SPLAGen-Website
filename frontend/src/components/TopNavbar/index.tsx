import { CurrentUser } from "@/components/CurrentUser";
import { LanguageSwitcher } from "@/components/languageSwitcher";

import styles from "./styles.module.css";

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
