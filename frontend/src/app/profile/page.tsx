"use client";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import styles from "./page.module.css";

import { ProfessionalInfo, User, getProfInfo, getWhoAmI } from "@/api/users";
import { Button, EditBasicInfoModal, ProfessionalInfoModal } from "@/components";
import { PreferredLanguages } from "@/components/PreferredLanguages";
import { ProfilePicture } from "@/components/ProfilePicture";

type DisplayComponentProps = {
  user: User | null;
  prof: ProfessionalInfo | null;
  openBasic: () => void; // setIsBasicModalOpen
  openPro: () => void; // setIsProModalOpen
};

const ProfileSection = ({ user, prof, openBasic, openPro }: DisplayComponentProps) => {
  const { t } = useTranslation(); // define the t function at the top of your component

  return (
    <div className="flex flex-col gap-5">
      <div className={styles.nameCard}>
        <div className="flex items-center gap-5">
          <ProfilePicture size="small" />
          <div className={styles.nameAndTitle}>
            <span>
              {" "}
              {user?.personal.firstName ?? t("first-name")}{" "}
              {user?.personal.lastName ?? t("last-name")}{" "}
            </span>
            <span> {prof?.title ?? t("membership")} </span>
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
                {user?.personal.firstName ?? t("user")}
              </li>

              <li>
                <label> {t("email")} </label> <br />
                {user?.personal.email ?? t("email")}
              </li>
            </ul>

            <article className={styles.infoColumn}>
              <ul className={styles.infoColumn}>
                <li>
                  <label> {t("last-name")} </label> <br />
                  {user?.personal.lastName ?? t("user")}
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
                {prof?.title ? prof.title : t("title")}
              </li>

              <li>
                <label> {t("preferred-language")} </label>
                <br />
                <PreferredLanguages languages={prof?.prefLanguages} />
              </li>
            </ul>

            <article className={styles.infoColumn}>
              <ul className={styles.infoColumn}>
                <li>
                  <label> {t("country")} </label> <br />
                  {prof?.country ? prof.country : t("none")}
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
  const [basicUserData, setBasicUserData] = useState<User | null>(null);
  const [professionalUserData, setProfUserData] = useState<ProfessionalInfo | null>(null);

  // Basic and Personal Modal state tracking
  const [isBasicModalOpen, setIsBasicModalOpen] = useState(false);
  const [isProfModalOpen, setIsProfModalOpen] = useState(false);

  // Profile and Directory form state
  const [formState, setFormState] = useState<"Profile" | "Directory">("Profile");
  let DisplayComponent = formState === "Profile" ? ProfileSection : DirectorySection;

  // Fetch User data with frontend api call
  const fetchPersonalUserData = useCallback(async () => {
    const res = await getWhoAmI("temp_firebase_token");
    if (res.success) {
      setBasicUserData(res.data);
    }
  }, []);

  // Fetch professional data
  const fetchProfessionalUserData = useCallback(async () => {
    const res = await getProfInfo("temp_firebase_token");
    if (res.success) {
      setProfUserData(res.data);
    }
  }, []);

  // Use effect updates page's basic and personal user info
  useEffect(() => {
    fetchPersonalUserData().catch((err: unknown) => {
      console.error("Error in fetchData user:", err);
    });

    fetchProfessionalUserData().catch((err: unknown) => {
      console.error("Error in fetchData prof:", err);
    });
  }, [fetchPersonalUserData, fetchProfessionalUserData]);

  // Modal State management
  const handleOpenBasicModal = () => {
    setIsBasicModalOpen(true);
  };

  const handleCloseBasicModal = () => {
    setIsBasicModalOpen(false);
    void fetchPersonalUserData();
  };

  const handleOpenProfessionalInfoModal = () => {
    setIsProfModalOpen(true);
  };

  const handleCloseProfessionalInfoModal = () => {
    setIsProfModalOpen(false);
    void fetchProfessionalUserData();
  };

  switch (formState) {
    case "Profile":
      DisplayComponent = ProfileSection;
      break;

    case "Directory":
      DisplayComponent = DirectorySection;
      break;
  }

  const membershipStatus = professionalUserData?.title;

  return (
    <div className={styles.profileContainer}>
      <header>
        <h1> {formState} </h1>
        <div className="flex items-center gap-2">
          <ProfilePicture />
          <button> {basicUserData?.personal.firstName} </button>
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
      <ProfessionalInfoModal isOpen={isProfModalOpen} onClose={handleCloseProfessionalInfoModal} />

      <DisplayComponent
        user={basicUserData}
        prof={professionalUserData}
        openBasic={handleOpenBasicModal}
        openPro={handleOpenProfessionalInfoModal}
      />
    </div>
  );
};

export default ProfilePage;
