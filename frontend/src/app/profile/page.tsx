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
import "@/app/globals.css";

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
  masters: "masters",
  phd: "phd",
  md: "md",
  fellowship: "fellowship",
  diploma: "diploma",
  other: "other",
  "": "",
} as const;

const ProfileSection = ({ user, openBasic, openPro }: DisplayComponentProps) => {
  const { t } = useTranslation(); // define the t function at the top of your component
  const [isProfilePictureModalOpen, setIsProfilePictureModalOpen] = useState(false);
  const [isStudentInfoModalOpen, setIsStudentInfoModalOpen] = useState(false);
  const [isAssociateInfoModalOpen, setIsAssociateInfoModalOpen] = useState(false);

  const formatMembership = (membership: MembershipType | undefined): string => {
    return membership ? t(membershipDisplayMap[membership] ?? "none") : t("none");
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
              <Button variant="secondary" label={t("edit-membership-category")} />
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
              value: professionalTitleOptions.find(
                (option) => option.value === user?.professional?.title,
              )
                ? t(
                    professionalTitleOptions.find(
                      (option) => option.value === user?.professional?.title,
                    )?.label ?? "",
                  ) +
                  (!professionalTitleOptions.find(
                    (option) => option.value === user?.professional?.title,
                  ) && user?.professional?.title
                    ? ` (${String(user?.professional?.title)})`
                    : "")
                : user?.professional?.title
                  ? `${t("other")} (${String(user?.professional?.title)})`
                  : t("other"),
            },
            {
              label: t("preferred-language"),
              value: <PreferredLanguages language={user?.professional?.prefLanguage} />,
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
                    ? t("pending")
                    : t("no"),
            },
          ]}
        />

        {isStudent && (
          <ProfilePageCard
            title={t("student-information-title")}
            onClickEdit={() => {
              setIsStudentInfoModalOpen(true);
            }}
            leftColumnFields={[
              {
                label: t("school-country-short"),
                value: getCountryLabelFromCode(user?.education?.schoolCountry),
              },
              { label: t("school-name-short"), value: user?.education?.institution },
              { label: t("university-email-short"), value: user?.education?.email },
            ]}
            rightColumnFields={[
              {
                label: t("degree-short"),
                value: t(degreesToReadable[user.education?.degree ?? ""] || "other"),
              },
              { label: t("program-name-short"), value: user?.education?.program },
              { label: t("graduation-date-short"), value: user?.education?.gradDate },
            ]}
          />
        )}

        {isAssociate && (
          <ProfilePageCard
            title={t("associate-information-title")}
            onClickEdit={() => {
              setIsAssociateInfoModalOpen(true);
            }}
            leftColumnFields={[
              { label: t("job-title-short"), value: user?.associate?.title },
              {
                label: t("specializations-short"),
                value: user?.associate?.specialization
                  ?.map((s) => {
                    const key = SPECIALIZATIONS.find((spec) => spec.toLowerCase() === s);
                    return key ? t(key) : null;
                  })
                  .filter(Boolean)
                  .join(", "),
              },
            ]}
            rightColumnFields={[
              {
                label: t("organization-representative-short"),
                value: user?.associate?.organization ? t("yes") : t("no"),
              },
              {
                label: t("organization-name-short"),
                value: user?.associate?.organization ?? t("na"),
              },
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
        <p className={styles.directoryTitle}>{t("not-in-directory")}</p>
        <p>{t("only-full-members")}</p>
        <a href="https://www.splagen.org/en/membresia" target="_blank" rel="noopener noreferrer">
          <Button label={t("learn-more-membership")} />
        </a>
      </div>
    );
  }

  // User is not in directory, but can join - link them to the directory form
  switch (user?.account.inDirectory) {
    case false:
      return (
        <div className={styles.directoryColumn}>
          <p className={styles.directoryTitle}>{t("not-in-directory-yet")}</p>
          <Link href="/directoryForm">
            <Button label={t("join-directory")} />
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
                  t("directory-request-pending")
                : /* User is in the directory and can edit their information */
                  t("edits-reflected-directory")}
            </p>
          )}

          {(user?.account.inDirectory === true || user?.account.inDirectory === "pending") && (
            <Button
              className="mr-auto"
              label={
                user?.account.inDirectory === "pending"
                  ? t("cancel-directory-request")
                  : t("remove-from-directory")
              }
              onClick={onLeaveDirectory}
            />
          )}

          <div className={styles.infoContainer}>
            <ProfilePageCard
              title={t("personal-info")}
              onClickEdit={openPersonal}
              leftColumnFields={[
                {
                  label: t("degree-certification-short"),
                  value: t(
                    educationTypeOptions.find((option) => option.value === user?.education?.degree)
                      ?.label ?? "other",
                  ),
                },
                { label: t("work-clinic-short"), value: user?.clinic?.name },
                { label: t("clinic-website-short"), value: user?.clinic?.url },
              ]}
              rightColumnFields={[
                { label: t("education-institution"), value: user?.education?.institution },
                {
                  label: t("clinic-address-short"),
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
              title={t("display-info")}
              onClickEdit={openDisplay}
              leftColumnFields={[
                {
                  label: t("work-email-short"),
                  value: user?.display?.workEmail,
                },
                {
                  label: t("genetic-services-short"),
                  value: (user?.display?.services?.length ?? 0) > 0 && (
                    <div>
                      {user?.display?.services?.map((service) => (
                        <p key={service}>{specialtyOptionsToFrontend[service]}</p>
                      ))}
                    </div>
                  ),
                },
                {
                  label: t("license-number-short"),
                  value: user?.display?.license?.[0] ? user?.display?.license?.[0] : t("none"),
                },
                {
                  label: t("offer-remote-services-question"),
                  value: user?.display?.options?.remote ? t("yes") : t("no"),
                },
                {
                  label: t("authorized-care-question"),
                  value:
                    user?.display?.options?.authorizedCare === "unsure"
                      ? t("unsure")
                      : user?.display?.options?.authorizedCare === true
                        ? t("yes")
                        : t("no"),
                },
              ]}
              rightColumnFields={[
                {
                  label: t("work-phone-short"),
                  value: user?.display?.workPhone,
                },
                {
                  label: t("language-used-care"),

                  value: <PreferredLanguages languages={user?.display?.languages ?? []} />,
                },
                {
                  label: t("patient-request-tests"),
                  value: user?.display?.options?.openToRequests ? t("yes") : t("no"),
                },
                {
                  label: t("patient-make-appointments"),
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
  const { t } = useTranslation();
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
  const [loadingLeaveDirectory, setLoadingLeaveDirectory] = useState(false);

  // Profile and Directory form state
  const formState = (searchParams.get("tab") ?? "Profile") as Tab;
  const DisplayComponent = formState === "Profile" ? ProfileSection : DirectorySection;

  const { user, firebaseUser, reloadUser } = useContext(UserContext);

  const handleLeaveDirectory = async () => {
    if (!firebaseUser) return;

    try {
      setErrorMessage("");
      setLoadingLeaveDirectory(true);
      const token = await firebaseUser.getIdToken();
      const response = await leaveDirectory(token);
      if (response.success) {
        setIsLeaveDirectoryPopupOpen(false);
        setSuccessMessage(
          user?.account.inDirectory === "pending"
            ? t("directory-request-cancelled")
            : t("removed-from-directory"),
        );
        await reloadUser();
      } else {
        setErrorMessage(`${t("failed-leave-directory")}: ${response.error}`);
      }
    } catch (error) {
      setErrorMessage(`${t("failed-leave-directory")}: ${String(error)}`);
    } finally {
      setLoadingLeaveDirectory(false);
    }
  };

  return (
    <div className={styles.profileContainer}>
      <header>
        <h1>{t("profile")}</h1>
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
        loading={loadingLeaveDirectory}
      >
        <p>
          {user?.account.inDirectory === "pending"
            ? t("cancel-directory-request-confirm")
            : t("remove-from-directory-confirm")}
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
