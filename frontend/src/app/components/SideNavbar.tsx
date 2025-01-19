"use client";
import Image from "next/image";
import { useState } from "react";

import logo from "../../../public/images/Logo_SPLAGen1.png";

import NavCard from "./NavCard";
import cardStyle from "./NavCard.module.css";
import styles from "./SideNavbar.module.css";
// Props for each navigation card on sidebar
type CardProps = {
  iconDark: string;
  iconLight: string;
  navigateTo: string;
  message: string;
};

// There are 5 modes.
// 1. Counselor
// 2. Admin
// 3. Onboarding
// 4. Directory
// 5. Blank

// Items for the navbar's "Couneslor" mode...
const adminItems: CardProps[] = [
  {
    iconDark: "dashboard_dark.svg",
    iconLight: "dashboard_light.svg",
    navigateTo: "/dashboard",
    message: "Dashboard",
  },
  {
    iconDark: "discussion_dark.svg",
    iconLight: "discussion_light.svg",
    navigateTo: "/discussion",
    message: "Discussion",
  },
  {
    iconDark: "announcements_dark.svg",
    iconLight: "announcements_light.svg",
    navigateTo: "/announcements",
    message: "Announcements",
  },
  {
    iconDark: "counselors_dark.svg",
    iconLight: "counselors_light.svg",
    navigateTo: "/counselors",
    message: "Counselors",
  },
  {
    iconDark: "admins_dark.svg",
    iconLight: "admins_light.svg",
    navigateTo: "/admins",
    message: "Admins",
  },
];

const CounselorItems: CardProps[] = [
  {
    iconDark: "dashboard_dark.svg",
    iconLight: "dashboard_light.svg",
    navigateTo: "/dashboard",
    message: "Dashboard",
  },
  {
    iconDark: "discussion_dark.svg",
    iconLight: "discussion_light.svg",
    navigateTo: "/discussion",
    message: "Discussion",
  },
  {
    iconDark: "announcements_dark.svg",
    iconLight: "announcements_light.svg",
    navigateTo: "/announcements",
    message: "Announcements",
  },
  {
    iconDark: "newsletter_dark.svg",
    iconLight: "newsletter_light.svg",
    navigateTo: "/newsletter",
    message: "Newsletter",
  },
];

const handleClick = () => {
  alert("Are you sure you want to log out?");
};

const SideNavbar: React.FC = () => {
  const [navState, setNavState] = useState<
    "Counselor" | "Admin" | "Onboarding" | "Directory" | "blank"
  >("Admin"); // Default to 'Admin'

  const handleStateChange = (
    newState: "Counselor" | "Admin" | "Onboarding" | "Directory" | "blank",
  ) => {
    setNavState(newState);
  };

  return (
    <section className={styles.SideNavbar}>
      <div className={styles.decoration}>
        <Image src={logo} alt="" aria-hidden="true" id={styles.logo} />
        <strong>SPLAGen</strong>
      </div>

      {/* Navigation cards: change depending on who's logged in. */}
      <div className={styles.cards}>
        <span className="text-gray-500">OVERVIEW</span>

        {navState === "Counselor" || navState === "Admin" ? (
          // Render CounselorItems, AdminItems depending on the state.
          navState === "Admin" ? (
            adminItems.map((item, index) => (
              <NavCard
                key={index}
                iconDark={item.iconDark}
                iconLight={item.iconLight}
                navigateTo={item.navigateTo}
                message={item.message}
              />
            ))
          ) : (
            CounselorItems.map((item, index) => (
              <NavCard
                key={index}
                iconDark={item.iconDark}
                iconLight={item.iconLight}
                navigateTo={item.navigateTo}
                message={item.message}
              />
            ))
          )
        ) : // Renders Onboarding or Directory depending on the state.
        navState === "Onboarding" ? (
          <div className={styles.onboarding}>
            <span>Onboarding</span>
          </div>
        ) : navState === "Directory" ? (
          <div className={styles.directory}>Directory</div>
        ) : (
          <div></div>
        )}
      </div>

      {/* Temporary demonstration buttons to switch navbar states*/}
      <div className={styles.navButtons}>
        <button
          onClick={() => {
            handleStateChange("Counselor");
          }}
          className={styles.navButton}
        >
          Counselor
        </button>
        <button
          onClick={() => {
            handleStateChange("Admin");
          }}
          className={styles.navButton}
        >
          Admin
        </button>
        <button
          onClick={() => {
            handleStateChange("Onboarding");
          }}
          className={styles.navButton}
        >
          Onboarding
        </button>
        <button
          onClick={() => {
            handleStateChange("Directory");
          }}
          className={styles.navButton}
        >
          Directory
        </button>
        <button
          onClick={() => {
            handleStateChange("blank");
          }}
          className={styles.navButton}
        >
          Blank
        </button>
      </div>

      {/* // Logout button */}
      <button className={cardStyle.card} id={styles.logout} onClick={handleClick}>
        <Image src="/icons/logout_dark.svg" alt="Logout" width={24} height={24} />
        Log out
      </button>
    </section>
  );
};
export default SideNavbar;
