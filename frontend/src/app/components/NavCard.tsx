"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import style from "./NavCard.module.css";

// Props for each page card on the sidebar
type CardProps = {
  iconLight: string;
  iconDark: string;
  message: string;
  navigateTo: string;
};

// Changes styles depending on active page
const NavCard = ({ iconLight, iconDark, message, navigateTo }: CardProps) => {
  const pathname = usePathname(); // Get the current path
  const isActive = pathname === navigateTo; // Check if the current path matches the navigation path

  return (
    <Link href={navigateTo} className={`${style.card} ${isActive ? style.activePage : ""}`}>
      <Image
        src={isActive ? `/icons/${iconLight}` : `/icons/${iconDark}`}
        alt=""
        width={24}
        height={24}
      />
      {message}
    </Link>
  );
};

export default NavCard;
