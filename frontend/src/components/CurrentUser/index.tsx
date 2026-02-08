import { ChevronDown, ChevronUp } from "lucide-react";
import Link from "next/link";
import { useContext, useState } from "react";
import { useTranslation } from "react-i18next";

import styles from "./styles.module.css";

import { logoutUser, membershipDisplayMap } from "@/api/users";
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
            {t(membershipDisplayMap[user.account.membership]) ?? t("none")}
          </p>
          <p className={styles.userRole}>{user?.role ? t(user.role) : t("none")}</p>
        </div>
        {showDropdown ? <ChevronUp /> : <ChevronDown />}
      </div>

      {showDropdown && (
        <div className={styles.buttonsContainer}>
          <Link href="/profile">
            <button
              className={styles.button}
              onClick={() => {
                setShowDropdown(false);
              }}
            >
              {t("profile")}
            </button>
          </Link>
          <button
            className={styles.button}
            onClick={() => {
              void logoutUser();
              setShowDropdown(false);
            }}
          >
            {t("log-out")}
          </button>
        </div>
      )}
    </div>
  ) : null;
};
