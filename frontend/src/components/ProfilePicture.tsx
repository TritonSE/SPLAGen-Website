import Image from "next/image";
import { useContext, useMemo } from "react";

import styles from "./ProfilePicture.module.css";

import { User } from "@/api/users";
import { UserContext } from "@/contexts/userContext";

type ProfilePictureProps = {
  user?: User | null;
  size?: "small" | "medium" | "large";
  letter?: string;
};

const imageSizes = {
  small: 48,
  medium: 80,
  large: 128,
};

// Renders fallback letter or first initial from user's first name
export const ProfilePicture: React.FC<ProfilePictureProps> = ({
  user = null,
  size = "small",
  letter,
}) => {
  const { user: myself } = useContext(UserContext);

  // Default to currently logged-in user if none is provided
  // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
  const userToUse = user === null ? myself : user;

  const displayLetter = useMemo(() => {
    if (letter?.length) return letter[0].toUpperCase();
    return userToUse?.personal?.firstName?.[0]?.toUpperCase() ?? "?";
  }, [letter, userToUse?.personal?.firstName]);

  const profileURL = userToUse?.account.profilePicture;

  return (
    <div className={`${styles.profilepic} ${styles[size]}`}>
      {profileURL ? (
        <Image
          src={profileURL}
          alt={displayLetter}
          width={imageSizes[size]}
          height={imageSizes[size]}
        />
      ) : (
        <span>{displayLetter}</span>
      )}
    </div>
  );
};
