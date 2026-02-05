"use client";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useContext, useState } from "react";
import { useTranslation } from "react-i18next";

import styles from "./page.module.css";

import { leaveDirectory } from "@/api/directory";
import { MembershipType, User, membershipDisplayMap, professionalTitleOptions } from "@/api/users";
import {
  Button,
  DirectoryPersonalInfoModal,
  EditBasicInfoModal,
  ProfessionalInfoModal,
} from "@/components";
import { getCountryLabelFromCode } from "@/components/CountrySelector";
import { PreferredLanguages } from "@/components/PreferredLanguages";
import { ProfilePageCard } from "@/components/ProfilePageCard";
import { ProfilePicture } from "@/components/ProfilePicture";
import { SuccessMessage } from "@/components/SuccessMessage";
import { Tabs } from "@/components/Tabs";
import { specialtyOptionsToFrontend } from "@/components/directoryForm/DirectoryServices";
import { EditAssociateInfoModal } from "@/components/modals/EditAssociateInfoModal";
import { EditDirectoryDisplayModal } from "@/components/modals/EditDirectoryDisplayModal";
import { EditStudentInfoModal } from "@/components/modals/EditStudentInfoModal";
import { TwoButtonPopup } from "@/components/modals/TwoButtonPopup";
import { UploadProfilePictureModal } from "@/components/modals/UploadProfilePictureModal";
import { educationTypeOptions } from "@/components/modals/displayInfoConstants";
import { SPECIALIZATIONS } from "@/constants/specializations";
import { UserContext } from "@/contexts/userContext";
import { useRedirectToLoginIfNotSignedIn } from "@/hooks/useRedirection";

const TABS = ["Profile", "Directory"] as const;
type Tab = (typeof TABS)[number];

type DisplayComponentProps = {
  user: User | null;

  // General
  openBasic: () => void;
  openPro: () => void;

  // Directory
  openPersonal: () => void;
  openDisplay: () => void;
  onLeaveDirectory?: () => void;
};

export const degreesToReadable = {
  masters: "Masters",
  phd: "PhD",
  md: "MD",
  fellowship: "Fellowship",
  diploma: "Diploma",
  other: "Other",
  "": "",
} as const;

const ProfileSection = ({ user, openBasic, openPro }: DisplayComponentProps) => {
  const { t } = useTranslation(); // define the t function at the top of your component
  const [isProfilePictureModalOpen, setIsProfilePictureModalOpen] = useState(false);
  const [isStudentInfoModalOpen, setIsStudentInfoModalOpen] = useState(false);
  const [isAssociateInfoModalOpen, setIsAssociateInfoModalOpen] = useState(false);

  const formatMembership = (membership: MembershipType | undefined): string => {
    return membership ? (membershipDisplayMap[membership] ?? "None") : "None";
  };

  const formattedMembership = formatMembership(user?.account.membership);
  const isStudent = user?.account.membership === "student";
  const isAssociate = user?.account.membership === "associate";

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

            <Link href="/editMembership">
              <Button variant="secondary" label="Edit Membership Category" />
            </Link>
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

        {isStudent && (
          <ProfilePageCard
            title="Student Information"
            onClickEdit={() => {
              setIsStudentInfoModalOpen(true);
            }}
            leftColumnFields={[
              {
                label: "School Country",
                value: getCountryLabelFromCode(user?.education?.schoolCountry),
              },
              { label: "School Name", value: user?.education?.institution },
              { label: "University Email", value: user?.education?.email },
            ]}
            rightColumnFields={[
              {
                label: "Degree",
                value: degreesToReadable[user.education?.degree ?? ""] ?? "Other",
              },
              { label: "Program Name", value: user?.education?.program },
              { label: "Graduation Date", value: user?.education?.gradDate },
            ]}
          />
        )}

        {isAssociate && (
          <ProfilePageCard
            title="Associate Information"
            onClickEdit={() => {
              setIsAssociateInfoModalOpen(true);
            }}
            leftColumnFields={[
              { label: "Job Title", value: user?.associate?.title },
              {
                label: "Specializations",
                value: user?.associate?.specialization
                  ?.map((s) => SPECIALIZATIONS.find((spec) => spec.toLowerCase() === s))
                  .filter(Boolean)
                  .join(", "),
              },
            ]}
            rightColumnFields={[
              {
                label: "Organization Representative",
                value: user?.associate?.organization ? "Yes" : "No",
              },
              // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
              { label: "Organization Name", value: user?.associate?.organization || "N/A" },
            ]}
          />
        )}
      </div>

      <UploadProfilePictureModal
        isOpen={isProfilePictureModalOpen}
        onClose={() => {
          setIsProfilePictureModalOpen(false);
        }}
      />

      {isStudent && (
        <EditStudentInfoModal
          isOpen={isStudentInfoModalOpen}
          onClose={() => {
            setIsStudentInfoModalOpen(false);
          }}
          populationInfo={user}
        />
      )}

      {isAssociate && (
        <EditAssociateInfoModal
          isOpen={isAssociateInfoModalOpen}
          onClose={() => {
            setIsAssociateInfoModalOpen(false);
          }}
          populationInfo={user}
        />
      )}
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
const DirectorySection = ({
  user,
  openPersonal,
  openDisplay,
  onLeaveDirectory,
}: DisplayComponentProps) => {
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

          {(user?.account.inDirectory === true || user?.account.inDirectory === "pending") && (
            <Button
              className="mr-auto"
              label={
                user?.account.inDirectory === "pending"
                  ? "Cancel my directory request"
                  : "Remove me from directory"
              }
              onClick={onLeaveDirectory}
            />
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
                      // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
                      getCountryLabelFromCode(user.clinic.location.country) ||
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

  const router = useRouter();
  const searchParams = useSearchParams();

  // Basic and Personal Modal state tracking
  const [isBasicModalOpen, setIsBasicModalOpen] = useState(false);
  const [isProfModalOpen, setIsProfModalOpen] = useState(false);
  const [isPersonalModalOpen, setIsPersonalModalOpen] = useState(false);
  const [isDisplayModalOpen, setIsDisplayModalOpen] = useState(false);
  const [isLeaveDirectoryPopupOpen, setIsLeaveDirectoryPopupOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Profile and Directory form state
  const formState = (searchParams.get("tab") ?? "Profile") as Tab;
  const DisplayComponent = formState === "Profile" ? ProfileSection : DirectorySection;

  const { user, firebaseUser, reloadUser } = useContext(UserContext);

  const handleLeaveDirectory = async () => {
    if (!firebaseUser) return;

    try {
      const token = await firebaseUser.getIdToken();
      const response = await leaveDirectory(token);
      if (response.success) {
        setIsLeaveDirectoryPopupOpen(false);
        setSuccessMessage(
          user?.account.inDirectory === "pending"
            ? "Directory request cancelled successfully"
            : "Successfully removed from directory",
        );
        await reloadUser();
      } else {
        setErrorMessage(`Failed to leave directory: ${response.error}`);
      }
    } catch (error) {
      setErrorMessage(`Failed to leave directory: ${String(error)}`);
    }
  };

  return (
    <div className={styles.profileContainer}>
      <header>
        <h1>Profile</h1>
      </header>

      <div className="mr-auto">
        <Tabs
          tabs={TABS}
          activeTab={formState}
          onActiveTabChange={(tab) => {
            router.push(`/profile?tab=${tab}`);
          }}
        />
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
        onLeaveDirectory={() => {
          setIsLeaveDirectoryPopupOpen(true);
        }}
      />

      <TwoButtonPopup
        isOpen={isLeaveDirectoryPopupOpen}
        variant="warning"
        onCancel={() => {
          setIsLeaveDirectoryPopupOpen(false);
        }}
        onConfirm={() => {
          void handleLeaveDirectory();
        }}
      >
        <p>
          {user?.account.inDirectory === "pending"
            ? "Are you sure you want to cancel your directory request?"
            : "Are you sure you want to remove yourself from the directory?"}
        </p>
      </TwoButtonPopup>

      <SuccessMessage
        message={successMessage}
        onDismiss={() => {
          setSuccessMessage("");
        }}
      />

      {errorMessage && <div className="text-red-500">{errorMessage}</div>}
    </div>
  );
};

export default ProfilePage;
