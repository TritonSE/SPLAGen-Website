"use client";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import styles from "./page.module.css";

import { User, getWhoAmI } from "@/api/users";
import { Button, EditBasicInfoModal, ProfessionalInfoModal } from "@/components";
import { PreferredLanguages } from "@/components/PreferredLanguages";
import { ProfilePicture } from "@/components/ProfilePicture";

type DisplayComponentProps = {
  user: User | null;
  openBasic: () => void; // setIsBasicModalOpen
  openPro: () => void; // setIsProModalOpen
};

const ProfileSection = ({ user, openBasic, openPro }: DisplayComponentProps) => {
  const { t } = useTranslation(); // define the t function at the top of your component

  const formatMembership = (
    membership: "student" | "geneticCounselor" | "healthcareProvider" | "associate" | undefined,
  ): string => {
    const membershipMap: Record<string, string> = {
      student: "Student",
      geneticCounselor: "Genetic Counselor",
      healthcareProvider: "Healthcare Provider",
      associate: "Associate",
    };

    return membership ? (membershipMap[membership] ?? "None") : "None";
  };

  const formattedMembership = formatMembership(user?.account.membership);

  return (
    <div className="flex flex-col gap-5">
      <div className={styles.nameCard}>
        <div className="flex items-center gap-5">
          <ProfilePicture size="small" />
          <div className={styles.nameAndTitle}>
            <span>
              {user?.personal.firstName ?? t("none")} {user?.personal.lastName ?? t("none")}
            </span>
            <span> {formattedMembership ?? t("none")} </span>
          </div>
        </div>

        <div className="flex items-center gap-5">
          <Button variant="primary" label={t("change-photo")} />
          <Button variant="secondary" label={t("remove-photo")} />
        </div>
      </div>

      <div className={styles.infoContainer}>
        <div className={styles.infoCard}>
          <header>
            <h2> {t("basic-info")} </h2>
            <button onClick={openBasic}>
              <Image src="/icons/line-md.svg" width={25} height={25} alt="Edit basic info icon" />
            </button>
          </header>

          <section className={styles.profileDetails}>
            <ul className={styles.infoColumn}>
              <li>
                <label> {t("first-name")} </label> <br />
                {user?.personal.firstName ?? t("none")}
              </li>

              <li>
                <label> {t("email")} </label> <br />
                {user?.personal.email ?? t("none")}
              </li>
            </ul>

            <article className={styles.infoColumn}>
              <ul className={styles.infoColumn}>
                <li>
                  <label> {t("last-name")} </label> <br />
                  {user?.personal.lastName ?? t("none")}
                </li>

                <li>
                  <label> {t("phone")} </label> <br />
                  {user?.personal.phone ?? t("none")}
                </li>
              </ul>
            </article>
          </section>
        </div>

        <div className={styles.infoCard}>
          <header>
            <h2> {t("professional-info")} </h2>
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
                <label> {t("professional-title")} </label> <br />
                {user?.professional.title ?? t("none")}
              </li>

              <li>
                <label> {t("preferred-language")} </label>
                <br />
                <PreferredLanguages languages={user?.professional.prefLanguages ?? []} />
              </li>
            </ul>

            <article className={styles.infoColumn}>
              <ul className={styles.infoColumn}>
                <li>
                  <label> {t("country")} </label> <br />
                  {user?.professional.country ?? t("none")}
                </li>

                <li>
                  <label> {t("splagen-directory")} </label> <br />
                  {user?.account.inDirectory ? t("yes") : t("no")}
                </li>
              </ul>
            </article>
          </section>
        </div>
      </div>
    </div>
  );
};

// Directory sub component
const DirectorySection = ({ user }: DisplayComponentProps) => {
  const { t } = useTranslation(); // define the t function at the top of your component

  return (
    <div>
      <b> {t("directory-information")} </b>
      <span> {user?.personal.lastName ?? t("directory-information")} </span>
    </div>
  );
};

// Main rendering component
const ProfilePage: React.FC = () => {
  const { t } = useTranslation(); // define the t function at the top of your component

  // Basic and Professional info updated with use effect and frontend api calls.
  const [userData, setUserData] = useState<User | null>(null);

  // Basic and Personal Modal state tracking
  const [isBasicModalOpen, setIsBasicModalOpen] = useState(false);
  const [isProfModalOpen, setIsProfModalOpen] = useState(false);

  // Profile and Directory form state
  const [formState, setFormState] = useState<"Profile" | "Directory">("Profile");
  let DisplayComponent = formState === "Profile" ? ProfileSection : DirectorySection;

  // Fetch User data with frontend api call
  const fetchUserData = useCallback(async () => {
    const res = await getWhoAmI("temp_firebase_token");
    if (res.success) {
      setUserData(res.data);
    }
  }, [setUserData]);

  // Use effect updates page's basic and personal user info
  useEffect(() => {
    fetchUserData().catch((err: unknown) => {
      console.error("Error in fetching user data: ", err);
    });
  }, [fetchUserData]);

  // Modal State management
  const handleOpenBasicModal = () => {
    setIsBasicModalOpen(true);
  };

  const handleCloseBasicModal = () => {
    setIsBasicModalOpen(false);
    void fetchUserData();
  };

  const handleOpenProfessionalInfoModal = () => {
    setIsProfModalOpen(true);
  };

  const handleCloseProfessionalInfoModal = () => {
    setIsProfModalOpen(false);
    void fetchUserData();
  };

  switch (formState) {
    case "Profile":
      DisplayComponent = ProfileSection;
      break;

    case "Directory":
      DisplayComponent = DirectorySection;
      break;
  }

  const membershipStatus = userData?.account.membership;

  return (
    <div className={styles.profileContainer}>
      <header>
        <h1> {formState} </h1>
        <div className="flex items-center gap-2">
          <ProfilePicture />
          <button> {userData?.personal.firstName} </button>
        </div>
      </header>

      <div className={styles.switch}>
        <Button
          variant={formState === "Profile" ? "primary" : "secondary"}
          label={t("profile")}
          onClick={() => {
            setFormState("Profile");
          }}
        />

        <Button
          variant={formState === "Directory" ? "primary" : "secondary"}
          label={t("directory")}
          onClick={() => {
            setFormState("Directory");
          }}
          className={membershipStatus === "student" ? "hidden" : ""}
        />
      </div>

      <EditBasicInfoModal isOpen={isBasicModalOpen} onClose={handleCloseBasicModal} />

      {userData && (
        <ProfessionalInfoModal
          isOpen={isProfModalOpen}
          onClose={handleCloseProfessionalInfoModal}
          populationInfo={userData}
        />
      )}

      <DisplayComponent
        user={userData}
        openBasic={handleOpenBasicModal}
        openPro={handleOpenProfessionalInfoModal}
      />
    </div>
  );
};

export default ProfilePage;
