"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useContext, useEffect, useState } from "react";

import { NavCard } from "./NavCard";
import cardStyle from "./NavCard.module.css";
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

const MembersProps: CardProps = {
  iconDark: "members_dark.svg",
  iconLight: "members_light.svg",
  navigateTo: "/members",
  message: "Members",
};

const AdminsProps: CardProps = {
  iconDark: "admins_dark.svg",
  iconLight: "admins_light.svg",
  navigateTo: "/admins",
  message: "Admins",
};

// Navigation items
const memberItems: CardProps[] = [DashboardProps, DiscussionProps, AnnouncementsProps];

const adminItems: CardProps[] = [...memberItems, MembersProps];

const superAdminItems: CardProps[] = [...adminItems, AdminsProps];

const onboardingStepLabels = ["Account Setup", "Personal Information", "Membership"];
const directoryStepLabels = [...onboardingStepLabels, "Directory"];

export const Navbar: React.FC = () => {
  const [navState, setNavState] = useState<NavStateType>(NavStateType.member);
  const { user, onboardingStep } = useContext(UserContext);

  const setNavStateByRole = useCallback(() => {
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
  }, [user, setNavState]);

  // NavState that dependes on the path
  const pathname = usePathname();

  useEffect(() => {
    switch (pathname) {
      case "/onboardingForm":
        setNavState(NavStateType.onboarding);
        break;
      case "/directory":
        setNavState(NavStateType.directory);
        break;
      case "/login":
        setNavState(NavStateType.blank);
        break;
      case "/signup":
        setNavState(NavStateType.onboarding);
        break;
      default:
        setNavStateByRole();
        break;
    }
  }, [pathname, setNavStateByRole, setNavState]);

  // Set the navState based on user role
  useEffect(setNavStateByRole, [user, setNavStateByRole]);

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
          OVERVIEW
        </span>
        {renderNavItems()}
      </div>

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
