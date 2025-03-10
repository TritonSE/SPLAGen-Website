"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import { NavCard } from "./NavCard";
import cardStyle from "./NavCard.module.css";
import styles from "./SideNavbar.module.css";

import logo from "@/../public/images/Logo_SPLAGen1.png";
// Props for each navigation card on sidebar

type CardProps = {
  iconDark: string;
  iconLight: string;
  navigateTo: string;
  message: string;
};

// Define the props for admin and counselor modes
const DashboardProps: CardProps = {
  iconDark: "dashboard_dark.svg",
  iconLight: "dashboard_light.svg",
  navigateTo: "/",
  message: "Dashboard",
};

const DiscussionProps: CardProps = {
  iconDark: "discussion_dark.svg",
  iconLight: "discussion_light.svg",
  navigateTo: "/discussion",
  message: "Discussion",
};

const AnnouncementsProps: CardProps = {
  iconDark: "announcements_dark.svg",
  iconLight: "announcements_light.svg",
  navigateTo: "/announcements",
  message: "Announcements",
};

const CounselorsProps: CardProps = {
  iconDark: "counselors_dark.svg",
  iconLight: "counselors_light.svg",
  navigateTo: "/counselors",
  message: "Counselors",
};

const AdminsProps: CardProps = {
  iconDark: "admins_dark.svg",
  iconLight: "admins_light.svg",
  navigateTo: "/admins",
  message: "Admins",
};

const NewsletterProps: CardProps = {
  iconDark: "newsletter_dark.svg",
  iconLight: "newsletter_light.svg",
  navigateTo: "/newsletter",
  message: "Newsletter",
};

// Navigation items
const adminItems: CardProps[] = [
  DashboardProps,
  DiscussionProps,
  AnnouncementsProps,
  CounselorsProps,
  AdminsProps,
];

const counselorItems: CardProps[] = [
  DashboardProps,
  DiscussionProps,
  AnnouncementsProps,
  NewsletterProps,
];

export const SideNavbar: React.FC = () => {
  const [navState, setNavState] = useState<
    "Counselor" | "Admin" | "Onboarding" | "Directory" | "blank"
  >("blank");

  const handleStateChange = (
    newState: "Counselor" | "Admin" | "Onboarding" | "Directory" | "blank",
  ) => {
    setNavState(newState);
  };

  const renderNavItems = () => {
    switch (navState) {
      case "Counselor":
        return counselorItems.map((item, index) => <NavCard key={index} {...item} />);
      case "Admin":
        return adminItems.map((item, index) => <NavCard key={index} {...item} />);
      case "Onboarding":
        return <div>onboarding</div>;
      case "Directory":
        return <div>directory</div>;
      case "blank":
        return <div></div>;
      default:
        return null;
    }
  };

  return (
    <section className={styles.SideNavbar}>
      <Link href="/" className={styles.decoration}>
        <Image src={logo} alt="SPLAGen logo" aria-hidden="true" id={styles.logo} />
        <strong>SPLAGen</strong>
      </Link>

      {/* Navigation cards */}
      <div className={styles.cards}>
        <span className="text-white-500" id={styles.overview}>
          OVERVIEW
        </span>
        {renderNavItems()}
      </div>

      {/* Temporary state-switch buttons */}
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

      {/* Logout button */}
      <button
        className={cardStyle.card}
        id={styles.logout}
        onClick={() => {
          alert("Are you sure you want to log out?");
        }}
      >
        <Image src="/icons/logout_light.svg" alt="Logout" width={24} height={24} />
        Log out
      </button>
    </section>
  );
};
