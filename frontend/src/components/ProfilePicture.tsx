import Link from "next/link";
import { useContext } from "react";

import styles from "./ProfilePicture.module.css";

import { UserContext } from "@/contexts/userContext";

type ProfilePictureProps = {
  size?: "small" | "medium" | "large";
};

export const ProfilePicture: React.FC<ProfilePictureProps> = ({ size = "small" }) => {
  const { user } = useContext(UserContext);
  const letter = user?.personal.firstName[0];

  return (
    <Link href="/profile" className={`${styles.profilepic} ${styles[size]}`}>
      <div>{letter ? letter : "?"}</div>
    </Link>
  );
};
