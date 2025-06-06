import { useContext, useMemo } from "react";

import styles from "./ProfilePicture.module.css";

import { UserContext } from "@/contexts/userContext";

type ProfilePictureProps = {
  size?: "small" | "medium" | "large";
  letter?: string;
};

// Renders fallback letter or first initial from user's first name
export const ProfilePicture: React.FC<ProfilePictureProps> = ({ size = "small", letter }) => {
  const { user } = useContext(UserContext);

  const displayLetter = useMemo(() => {
    if (letter?.length) return letter[0].toUpperCase();
    return user?.personal?.firstName?.[0]?.toUpperCase() ?? "?";
  }, [letter, user?.personal?.firstName]);

  return (
    <div className={`${styles.profilepic} ${styles[size]}`}>
      <span>{displayLetter}</span>
    </div>
  );
};
