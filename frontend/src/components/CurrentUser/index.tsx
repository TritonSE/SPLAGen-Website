import { ChevronDown, ChevronUp } from "lucide-react";
import { useContext, useState } from "react";
import { useTranslation } from "react-i18next";

import styles from "./styles.module.css";

import { logoutUser, professionalTitleOptions } from "@/api/users";
import { ProfilePicture } from "@/components/ProfilePicture";
import { UserContext } from "@/contexts/userContext";

export const CurrentUser = () => {
  const { t } = useTranslation();
  const { user } = useContext(UserContext);
  const [showDropdown, setShowDropdown] = useState(false);

  return user ? (
    <div className={styles.root}>
      <div
        className={styles.userDisplay}
        onClick={() => {
          setShowDropdown(!showDropdown);
        }}
      >
        <ProfilePicture size="small" />
        <div className={styles.userCol}>
          <p className={styles.userName}>
            {user?.personal.firstName ?? t("none")} {user?.personal.lastName ?? t("none")}
          </p>
          <p className={styles.userTitle}>
            {professionalTitleOptions.find((option) => option.value === user.professional?.title)
              ?.label ?? t("none")}
          </p>
          <p className={styles.userRole}>
            {user?.role ? user.role[0].toUpperCase() + user.role.substring(1) : t("none")}
          </p>
        </div>
        {showDropdown ? <ChevronUp /> : <ChevronDown />}
      </div>

      {showDropdown && (
        <div className={styles.buttonsContainer}>
          <a href="/profile">
            <button className={styles.button}>Profile</button>
          </a>
          <button
            className={styles.button}
            onClick={() => {
              void logoutUser();
            }}
          >
            Logout
          </button>
        </div>
      )}
    </div>
  ) : null;
};
