"use client";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useContext, useState } from "react";
import { useTranslation } from "react-i18next";

import styles from "./page.module.css";

import { MembershipType, User, membershipDisplayMap, professionalTitleOptions } from "@/api/users";
import {
  Button,
  DirectoryPersonalInfoModal,
  EditBasicInfoModal,
  ProfessionalInfoModal,
} from "@/components";
import { PreferredLanguages } from "@/components/PreferredLanguages";
import { ProfilePageCard } from "@/components/ProfilePageCard";
import { ProfilePicture } from "@/components/ProfilePicture";
import { specialtyOptionsToFrontend } from "@/components/directoryForm/DirectoryServices";
import { EditDirectoryDisplayModal } from "@/components/modals/EditDirectoryDisplayModal";
import { UploadProfilePictureModal } from "@/components/modals/UploadProfilePictureModal";
import { educationTypeOptions } from "@/components/modals/displayInfoConstants";
import { UserContext } from "@/contexts/userContext";
import { useRedirectToLoginIfNotSignedIn } from "@/hooks/useRedirection";

type DisplayComponentProps = {
  user: User | null;

  // General
  openBasic: () => void;
  openPro: () => void;

  // Directory
  openPersonal: () => void;
  openDisplay: () => void;
};

const ProfileSection = ({ user, openBasic, openPro }: DisplayComponentProps) => {
  const { t } = useTranslation(); // define the t function at the top of your component
  const [isProfilePictureModalOpen, setIsProfilePictureModalOpen] = useState(false);

  const formatMembership = (membership: MembershipType | undefined): string => {
    return membership ? (membershipDisplayMap[membership] ?? "None") : "None";
  };

  const formattedMembership = formatMembership(user?.account.membership);

  return (
    <div className="flex flex-col gap-5">
      <div className={styles.nameCard}>
        <div className="flex items-center gap-5">
          <ProfilePicture size="medium" />
          <div className={styles.nameAndTitle}>
            <span>
              {user?.personal.firstName ?? t("none")} {user?.personal.lastName ?? t("none")}
            </span>
            <span> {formattedMembership ?? t("none")} </span>
          </div>
        </div>

        <Button
          className={styles.profilePhotoButton}
          variant="primary"
          label={t("change-photo")}
          onClick={() => {
            setIsProfilePictureModalOpen(true);
          }}
        />
      </div>

      <div className={styles.infoContainer}>
        <ProfilePageCard
          title={t("basic-info")}
          onClickEdit={openBasic}
          leftColumnFields={[
            { label: t("first-name"), value: user?.personal.firstName },
            { label: t("email"), value: user?.personal.email },
          ]}
          rightColumnFields={[
            { label: t("last-name"), value: user?.personal.lastName },
            { label: t("phone"), value: user?.personal.phone },
          ]}
        />

        <ProfilePageCard
          title={t("professional-info")}
          onClickEdit={openPro}
          leftColumnFields={[
            {
              label: t("professional-title"),
              value:
                professionalTitleOptions.find(
                  (option) => option.value === user?.professional?.title,
                )?.label ?? `Other (${String(user?.professional?.title)})`,
            },
            {
              label: t("preferred-language"),
              value: <PreferredLanguages languages={user?.professional?.prefLanguages ?? []} />,
            },
          ]}
          rightColumnFields={[
            { label: t("country"), value: user?.professional?.country },
            {
              label: t("splagen-directory"),
              value:
                user?.account.inDirectory === true
                  ? t("yes")
                  : user?.account.inDirectory === "pending"
                    ? "Pending"
                    : t("no"),
            },
          ]}
        />
      </div>

      <UploadProfilePictureModal
        isOpen={isProfilePictureModalOpen}
        onClose={() => {
          setIsProfilePictureModalOpen(false);
        }}
      />
    </div>
  );
};

const formatAddress = (
  address: string | undefined,
  suite: string | undefined,
  city: string | undefined,
  state: string | undefined,
  country: string | undefined,
  zipCode: string | undefined,
) => (
  <div>
    {address && <p>{address}</p>}
    {suite && <p>{suite}</p>}
    <p>
      {city}, {state}, {country}
    </p>
    <p>{zipCode}</p>
  </div>
);

// Directory sub component
const DirectorySection = ({ user, openPersonal, openDisplay }: DisplayComponentProps) => {
  const { t } = useTranslation(); // define the t function at the top of your component

  if (user?.account.membership === "student" || user?.account.membership === "associate") {
    // User's membership type is ineligible to join directory
    return (
      <div className={styles.directoryColumn}>
        <p className={styles.directoryTitle}>You are not in the SPLAGen Directory</p>
        <p>Only full members can join the directory.</p>
        <a href="https://www.splagen.org/en/membresia" target="_blank" rel="noopener noreferrer">
          <Button label="Learn more about membership" />
        </a>
      </div>
    );
  }

  // User is not in directory, but can join - link them to the directory form
  switch (user?.account.inDirectory) {
    case false:
      return (
        <div className={styles.directoryColumn}>
          <p className={styles.directoryTitle}>You are not in the SPLAGen Directory yet</p>
          <Link href="/directoryForm">
            <Button label="Join the directory" />
          </Link>
        </div>
      );

    case true:
    case "pending":
    case undefined:
    default:
      return (
        <div className="flex flex-col gap-8">
          {user?.account.inDirectory === true ? null : (
            <p>
              {user?.account.inDirectory === "pending"
                ? /* User's request to join the directory is pending and they can still edit their information */
                  "Your request to join the directory is being reviewed by our staff. Feel free to update your information in the meantime!"
                : /* User is in the directory and can edit their information */
                  "Any edits made here will be reflected in the directory."}
            </p>
          )}

          <div className={styles.infoContainer}>
            <ProfilePageCard
              title="Personal Info"
              onClickEdit={openPersonal}
              leftColumnFields={[
                {
                  label: "Degree/certification",
                  value: educationTypeOptions.find(
                    (option) => option.value === user?.education?.degree,
                  )?.label,
                },
                { label: "Work Clinic", value: user?.clinic?.name },
                { label: "Clinic Website", value: user?.clinic?.url },
              ]}
              rightColumnFields={[
                { label: "Education Institution", value: user?.education?.institution },
                {
                  label: "Clinic Address",
                  value:
                    user?.clinic?.location &&
                    formatAddress(
                      user.clinic.location.address,
                      user.clinic.location.suite,
                      user.clinic.location.city,
                      user.clinic.location.state,
                      user.clinic.location.country,
                      user.clinic.location.zipPostCode,
                    ),
                },
              ]}
            />

            <ProfilePageCard
              title="Display Info"
              onClickEdit={openDisplay}
              leftColumnFields={[
                {
                  label: "Work Email",
                  value: user?.display?.workEmail,
                },
                {
                  label: "Genetic services",
                  value: (user?.display?.services?.length ?? 0) > 0 && (
                    <div>
                      {user?.display?.services?.map((service) => (
                        <p key={service}>{specialtyOptionsToFrontend[service]}</p>
                      ))}
                    </div>
                  ),
                },
                {
                  label: "License number",
                  value: user?.display?.license?.[0] ? user?.display?.license?.[0] : t("none"),
                },
                {
                  label: "Do you offer remote services?",
                  value: user?.display?.options?.remote ? t("yes") : t("no"),
                },
                {
                  label: "Are you authorized to provide care?",
                  value:
                    user?.display?.options?.authorizedCare === "unsure"
                      ? "Unsure"
                      : user?.display?.options?.authorizedCare === true
                        ? t("yes")
                        : t("no"),
                },
              ]}
              rightColumnFields={[
                {
                  label: "Work Phone",
                  value: user?.display?.workPhone,
                },
                {
                  label: "Language(s) used to provide care",

                  value: <PreferredLanguages languages={user?.display?.languages ?? []} />,
                },
                {
                  label: "Can patient request genetic tests?",
                  value: user?.display?.options?.openToRequests ? t("yes") : t("no"),
                },
                {
                  label: "Can patient make appointments for services?",
                  value: user?.display?.options?.openToAppointments ? t("yes") : t("no"),
                },
              ]}
            />
          </div>
        </div>
      );
  }
};

const ProfilePage: React.FC = () => {
  useRedirectToLoginIfNotSignedIn();

  const { t } = useTranslation();

  // Basic and Personal Modal state tracking
  const [isBasicModalOpen, setIsBasicModalOpen] = useState(false);
  const [isProfModalOpen, setIsProfModalOpen] = useState(false);
  const [isPersonalModalOpen, setIsPersonalModalOpen] = useState(false);
  const [isDisplayModalOpen, setIsDisplayModalOpen] = useState(false);

  // Profile and Directory form state
  const searchParams = useSearchParams();
  const formState = searchParams.get("tab") ?? "Profile";
  const DisplayComponent = formState === "Profile" ? ProfileSection : DirectorySection;

  const { user } = useContext(UserContext);

  return (
    <div className={styles.profileContainer}>
      <header>
        <h1> {formState} </h1>
      </header>

      <div className={styles.switch}>
        <Link href="/profile?tab=Profile">
          <Button
            variant={formState === "Profile" ? "primary" : "secondary"}
            label={t("profile")}
          />
        </Link>

        <Link href="/profile?tab=Directory">
          <Button
            variant={formState === "Directory" ? "primary" : "secondary"}
            label={t("directory")}
          />
        </Link>
      </div>

      <EditBasicInfoModal
        isOpen={isBasicModalOpen}
        onClose={() => {
          setIsBasicModalOpen(false);
        }}
        populationInfo={user}
      />

      <ProfessionalInfoModal
        isOpen={isProfModalOpen}
        onClose={() => {
          setIsProfModalOpen(false);
        }}
        populationInfo={user}
      />

      <EditDirectoryDisplayModal
        isOpen={isDisplayModalOpen}
        onClose={() => {
          setIsDisplayModalOpen(false);
        }}
        populationInfo={user}
      />

      <DirectoryPersonalInfoModal
        isOpen={isPersonalModalOpen}
        onClose={() => {
          setIsPersonalModalOpen(false);
        }}
        populationInfo={user}
      />

      <DisplayComponent
        user={user}
        openBasic={() => {
          setIsBasicModalOpen(true);
        }}
        openPro={() => {
          setIsProfModalOpen(true);
        }}
        openPersonal={() => {
          setIsPersonalModalOpen(true);
        }}
        openDisplay={() => {
          setIsDisplayModalOpen(true);
        }}
      />
    </div>
  );
};

export default ProfilePage;
