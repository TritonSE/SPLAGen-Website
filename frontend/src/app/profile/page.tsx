"use client";
import { ProfilePicture } from "@/components/ProfilePicture";

const Profile: React.FC = () => {
  return (
    <div>
      small
      <ProfilePicture size="small" />
      medium
      <ProfilePicture size="medium" />
      large
      <br />
      This large component takes in the letter d as an optional prop.
      <ProfilePicture size="large" letter="d" />
    </div>
  );
};

export default Profile;
