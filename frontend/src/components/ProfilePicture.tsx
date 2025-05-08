import { useContext } from "react";

import styles from "./ProfilePicture.module.css";

import { UserContext } from "@/contexts/userContext";

// component can be small, medium, or large
// takes in a string, can be letter of first name or first name.
type ProfilePictureProps = {
  size?: "small" | "medium" | "large";
  letter?: string;
};

//TODO: conditionally render the profile picture if there is a profile picture
export const ProfilePicture: React.FC<ProfilePictureProps> = ({ size = "small", letter }) => {
  const { user } = useContext(UserContext);

  const loggedInLetter = user?.personal.firstName[0];

  return (
    <div className={`${styles.profilepic} ${styles[size]}`}>
      <span>{letter ? letter[0] : loggedInLetter}</span>
    </div>
  );
};
