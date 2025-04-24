"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";

import styles from "./page.module.css";

import { User, getWhoAmI, updateBasicInfoRequest } from "@/api/users";
import { Button, EditBasicInfoModal, ProfessionalInfoModal } from "@/components";
import { ProfilePicture } from "@/components/ProfilePicture";

// changes
// edited user contller to give account info
// tweaked user frontend api to include account info

// behavior:
// Directory button dissapears if logged in user is a student.

// TODO
// - make user context update when we click submit

type DisplayComponentProps = {
  user: User | null;
  openBasic: () => void; // setIsBasicModalOpen
  openPro: () => void; // setIsProModalOpen
};

const Profile = ({ user, openBasic, openPro }: DisplayComponentProps) => {
  return (
    <div className="flex flex-col gap-5">
      <div className={styles.nameCard}>
        <div className="flex items-center gap-5">
          <ProfilePicture size="small" />
          <div className={styles.nameAndTitle}>
            <span> {user?.personal.firstName ?? "User"} </span>
            <span> {user?.account.membership ?? "Membership"} </span>
          </div>
        </div>

        <div className="flex items-center gap-5">
          <Button variant="primary" label="Change Photo" />
          <Button variant="secondary" label="Remove Photo" />
        </div>
      </div>

      <div className={styles.infoContainer}>
        <div className={styles.infoCard}>
          <header>
            <h2> Basic Info </h2>
            <button onClick={openBasic}>
              <Image src="/icons/line-md.svg" width={25} height={25} alt="Edit basic info icon" />
            </button>
          </header>

          <section className={styles.profileDetails}>
            <ul className={styles.infoColumn}>
              <li>
                <label> First Name </label> <br />
                {user?.personal.firstName ?? "User"}
              </li>

              <li>
                <label> Email </label> <br />
                {user?.personal.email ?? "Email"}
              </li>
            </ul>

            <article className={styles.infoColumn}>
              <ul className={styles.infoColumn}>
                <li>
                  <label> Last Name </label> <br />
                  {user?.personal.lastName ?? "User"}
                </li>

                <li>
                  <label> Phone </label> <br />
                  {user?.personal.phone ?? "None"}
                </li>
              </ul>
            </article>
          </section>
        </div>

        <div className={styles.infoCard}>
          <header>
            <h2> Professional Info </h2>
            <button onClick={openPro}>
              <Image
                src="/icons/line-md.svg"
                width={25}
                height={25}
                alt="Edit professional info icon"
              />
            </button>
          </header>

          <section className={styles.profileDetails}>
            <ul className={styles.infoColumn}>
              <li>
                <label> Professional Title </label> <br />
                {user?.account.membership ?? "Membership"}
              </li>

              <li>
                <label> Preferred Language(s) </label> <br />
                WIP
              </li>
            </ul>

            <article className={styles.infoColumn}>
              <ul className={styles.infoColumn}>
                <li>
                  <label> Country </label> <br />
                  WIP
                </li>

                <li>
                  <label> SPLAGen Directory </label> <br />
                  {user?.account.inDirectory ? "Yes" : "No"}
                </li>
              </ul>
            </article>
          </section>
        </div>
      </div>
    </div>
  );
};

// Sub component to render depending on what the user desires
// only accessible if user's account type is not a student

const Directory = ({ user }: DisplayComponentProps) => {
  return (
    <div>
      <b> Directory Information </b>
      <span> {user?.personal.lastName ?? "None"} </span>

      {/* <PillButton label="Edit 🖋️" onClick={}/> */}
    </div>
  );
};

const ProfilePage: React.FC = () => {
  // User data
  const [jsonUserData, setJsonUserData] = useState<User | null>(null);

  const fetchUserData = useCallback(async () => {
    const res = await getWhoAmI("temp_firebase_token");
    if (res.success) {
      setJsonUserData(res.data);
    }
  }, []);

  useEffect(() => {
    fetchUserData().catch((err: unknown) => {
      console.error("Error in fetchData:", err);
    });
  }, [fetchUserData]);

  // info modal
  const [isBasicModalOpen, setIsBasicModalOpen] = useState(false);
  const [isProfModalOpen, setIsProfModalOpen] = useState(false);

  const openBasicModal = () => {
    setIsBasicModalOpen(true);
  };

  const closeBasicModal = () => {
    setIsBasicModalOpen(false);
    void fetchUserData();
    console.log("closedBasicModal");
  };

  const openProModal = () => {
    setIsProfModalOpen(true);
  };

  const closeProModal = () => {
    setIsProfModalOpen(false);
    void fetchUserData();
  };

  // Profile and Directory
  const [state, setState] = useState<"Profile" | "Directory">("Profile");
  let DisplayComponent = state === "Profile" ? Profile : Directory;

  switch (state) {
    case "Profile":
      DisplayComponent = Profile;
      break;

    case "Directory":
      DisplayComponent = Directory;
      break;
  }

  const membershipStatus = jsonUserData?.account.membership; // "student" | "geneticCounselor" |  "healthcareProvider" | "associate";

  return (
    <div className={styles.profileContainer}>
      <button
        onClick={() => {
          fetchUserData().catch((err: unknown) => {
            console.error("Error in fetchData:", err);
          });
          console.log(jsonUserData);
        }}
      >
        {" "}
        CLick me{" "}
      </button>
      <header>
        <h1> {state} </h1>
        <div className="flex items-center gap-2">
          <ProfilePicture />
          <button> name </button>
        </div>
      </header>

      <div className={styles.switch}>
        <Button
          variant={state === "Profile" ? "primary" : "secondary"}
          label={"Profile"}
          onClick={() => {
            setState("Profile");
          }}
        />

        <Button
          variant={state === "Directory" ? "primary" : "secondary"}
          label={"Directory"}
          onClick={() => {
            setState("Directory");
          }}
          className={membershipStatus === "student" ? "hidden" : ""}
        />
      </div>

      <EditBasicInfoModal isOpen={isBasicModalOpen} onClose={closeBasicModal} />
      <ProfessionalInfoModal isOpen={isProfModalOpen} onClose={closeProModal} />

      {jsonUserData && (
        <DisplayComponent user={jsonUserData} openBasic={openBasicModal} openPro={openProModal} />
      )}
    </div>
  );
};

export default ProfilePage;
