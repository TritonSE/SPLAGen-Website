import { ChevronDown, ChevronUp } from "lucide-react";
import { useContext, useState } from "react";

import styles from "./styles.module.css";

import { logoutUser } from "@/api/users";
import { ProfilePicture } from "@/components/ProfilePicture";
import { UserContext } from "@/contexts/userContext";

export const CurrentUser = () => {
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
        <ProfilePicture />
        <div className={styles.userCol}>
          <p className={styles.userName}>
            {user?.personal.firstName} {user?.personal?.lastName}
          </p>
          <p className={styles.userRole}>
            {user?.role ? user.role[0].toUpperCase() + user.role.substring(1) : ""}
          </p>
        </div>
        {showDropdown ? <ChevronUp /> : <ChevronDown />}
      </div>

      {showDropdown && (
        <button
          className={styles.logoutButton}
          onClick={() => {
            void logoutUser();
          }}
        >
          Logout
        </button>
      )}
    </div>
  ) : null;
};
