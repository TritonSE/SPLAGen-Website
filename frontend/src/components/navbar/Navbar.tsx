"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { NavCard } from "./NavCard";
import styles from "./Navbar.module.css";
import { VerticalStepper } from "./VerticalStepper";

import logo from "@/../public/images/Logo_SPLAGen1.png";
import { UserContext } from "@/contexts/userContext";

// Props for each navigation card on sidebar
type CardProps = {
  iconDark: string;
  iconLight: string;
  navigateTo: string;
  message: string;
};

enum NavStateType {
  member = "member",
  admin = "admin",
  superadmin = "superadmin",
  onboarding = "onboarding",
  directory = "directory",
  blank = "blank",
}

// Define the props for admin and counselor modes
const DashboardProps: CardProps = {
  iconDark: "dashboard_dark.svg",
  iconLight: "dashboard_light.svg",
  navigateTo: "/",
  message: "dashboard",
};

const DiscussionProps: CardProps = {
  iconDark: "discussion_dark.svg",
  iconLight: "discussion_light.svg",
  navigateTo: "/discussion",
  message: "discussion",
};

const AnnouncementsProps: CardProps = {
  iconDark: "announcements_dark.svg",
  iconLight: "announcements_light.svg",
  navigateTo: "/announcements",
  message: "announcements",
};

const MembersProps: CardProps = {
  iconDark: "members_dark.svg",
  iconLight: "members_light.svg",
  navigateTo: "/members",
  message: "members",
};

const AdminsProps: CardProps = {
  iconDark: "admins_dark.svg",
  iconLight: "admins_light.svg",
  navigateTo: "/admins",
  message: "admins",
};

// Navigation items
const memberItems: CardProps[] = [DashboardProps, DiscussionProps, AnnouncementsProps];

const adminItems: CardProps[] = [...memberItems, MembersProps];

const superAdminItems: CardProps[] = [...adminItems, AdminsProps];

const onboardingStepLabels = ["account-setup", "personal-info", "membership"];
const directoryStepLabels = [...onboardingStepLabels, "directory"];

export const Navbar: React.FC = () => {
  const [navState, setNavState] = useState<NavStateType>(NavStateType.member);
  const { user, onboardingStep } = useContext(UserContext);
  const { t } = useTranslation();

  const pathname = usePathname();

  // Determine Navigation based on route and or user role
  useEffect(() => {
    switch (pathname) {
      case "/signup":
        setNavState(NavStateType.onboarding);
        break;
      case "/directory":
        setNavState(NavStateType.directory);
        break;
      case "/login":
        setNavState(NavStateType.blank);
        break;
      default:
        if (user) {
          switch (user.role) {
            case "member":
              setNavState(NavStateType.member);
              break;
            case "admin":
              setNavState(NavStateType.admin);
              break;
            case "superadmin":
              setNavState(NavStateType.superadmin);
              break;
          }
        }
        break;
    }
  }, [pathname, user, setNavState]);

  const renderNavItems = useCallback(() => {
    switch (navState) {
      case NavStateType.member:
        return memberItems.map((item, index) => <NavCard key={index} {...item} />);
      case NavStateType.admin:
        return adminItems.map((item, index) => <NavCard key={index} {...item} />);
      case NavStateType.superadmin:
        return superAdminItems.map((item, index) => <NavCard key={index} {...item} />);
      case NavStateType.onboarding:
        return (
          <VerticalStepper steps={onboardingStepLabels} activeStep={onboardingStep} /> // Set Active Step here
        );
      case NavStateType.directory:
        return <VerticalStepper steps={directoryStepLabels} activeStep={3} />;
      case NavStateType.blank:
        return null;
    }
  }, [navState, onboardingStep]);

  return (
    <section className={styles.SideNavbar}>
      <Link href="/" className={styles.decoration}>
        <Image src={logo} alt="SPLAGen logo" aria-hidden="true" id={styles.logo} />
        <strong>SPLAGen</strong>
      </Link>

      {/* Navigation cards */}
      <div className={styles.cards}>
        <span
          className={styles.overview}
          style={{
            display: [NavStateType.member, NavStateType.admin, NavStateType.superadmin].includes(
              navState,
            )
              ? "block"
              : "none",
          }}
        >
          {t("overview")}
        </span>
        {renderNavItems()}
      </div>
    </section>
  );
};
