import { useTranslation } from "react-i18next";

import styles from "./styles.module.css";

type TabsProps<T extends string> = {
  tabs: readonly T[];
  activeTab: T;
  onActiveTabChange: (newTab: T) => unknown;
};

export const Tabs = <T extends string>({ tabs, activeTab, onActiveTabChange }: TabsProps<T>) => {
  const { t } = useTranslation();

  return (
    <div className={styles.tabsContainer}>
      {tabs.map((tab) => (
        <div
          key={tab}
          className={`${styles.tab} ${activeTab === tab ? styles.activeTab : ""}`}
          onClick={() => {
            onActiveTabChange(tab);
          }}
        >
          {t(tab)}
        </div>
      ))}
    </div>
  );
};
