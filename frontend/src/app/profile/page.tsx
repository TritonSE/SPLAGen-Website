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
      <ProfilePicture size="large" />
    </div>
  );
};

export default Profile;
