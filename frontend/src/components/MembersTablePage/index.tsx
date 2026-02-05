import { Icon, Table } from "@tritonse/tse-constellation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import moment from "moment";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { ReactNode, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import styles from "./styles.module.css";

import {
  FilterOptions,
  USERS_PAGE_SIZE,
  User,
  formatUserFullName,
  getFilterOptions,
  getMultipleUsers,
  membershipDisplayMap,
  professionalTitleOptions,
} from "@/api/users";
import { degreesToReadable } from "@/app/profile/page";
import {
  ApproveDirectoryRequestPopup,
  Button,
  DenyDirectoryRequestPopup,
  RemoveAdminPopup,
} from "@/components";
import { Chip } from "@/components/Chip";
import { getCountryLabelFromCode } from "@/components/CountrySelector";
import { InviteAdminPopup } from "@/components/InviteAdminPopup";
import { Pagination } from "@/components/Pagination";
import { PreferredLanguages } from "@/components/PreferredLanguages";
import { ProfilePicture } from "@/components/ProfilePicture";
import { Tabs } from "@/components/Tabs";
import { specialtyOptionsToFrontend } from "@/components/directoryForm/DirectoryServices";
import {
  educationTypeOptions,
  serviceKeyToLabelMap,
} from "@/components/modals/displayInfoConstants";
import { SPECIALIZATIONS } from "@/constants/specializations";
import { UserContext } from "@/contexts/userContext";

const languageColors = {
  english: "#D3E4EE",
  spanish: "#E1E0F4",
  portuguese: "#DBECDB",
  other: "#FFFFFF",
};

const serviceColors = {
  pediatrics: "#D3E4EE",
  cardiovascular: "#E1E0F4",
  neurogenetics: "#DBECDB",
  rareDiseases: "#FFE2EF",
  cancer: "#FDECCA",
  biochemical: "#FADECA",
  prenatal: "#edbbc1",
  adult: "#b2dbd3",
  psychiatric: "#e3baaa",
  reproductive: "##b4b7ed",
  ophthalmic: "##cc85c7",
  research: "#77a38d",
  pharmacogenomics: "#c6d979",
  metabolic: "##6a9174",
  other: "#FFFFFF",
};

export const MembersTablePage = ({ adminsView }: { adminsView: boolean }) => {
  const { t } = useTranslation();

  const [page, setPage] = useState(1);
  const [numPages, setNumPages] = useState(1);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("");
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({});
  const [editingFilters, setEditingFilters] = useState<Record<string, string[]>>({});
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    title: [],
    membership: [],
    education: [],
    services: [],
    location: [],
  });

  const router = useRouter();
  const searchParams = useSearchParams();
  const directoryTab = searchParams.get("tab") ?? "all";
  const directoryOnly = directoryTab === "directory";
  const setDirectoryOnly = (newDirectoryOnly: boolean) => {
    router.push(
      `/${adminsView ? "admins" : "members"}?tab=${newDirectoryOnly ? "directory" : "all"}`,
    );
  };
  const [activeTab, setActiveTab] = useState("Approved");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [sidebarUserIdx, setSidebarUserIdx] = useState(-1);
  const [sidebarTab, setSidebarTab] = useState<"Information" | "Directory Responses">(
    "Information",
  );
  const [users, setUsers] = useState<User[]>();
  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});
  const [approvingMembers, setApprovingMembers] = useState<User[]>([]);
  const [denyingMembers, setDenyingMembers] = useState<User[]>([]);
  const [removingAdmins, setRemovingAdmins] = useState<User[]>([]);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const { firebaseUser } = useContext(UserContext);

  const selectedUsers = useMemo(
    () => users?.filter((user) => rowSelection[user._id]) ?? [],
    [users, rowSelection],
  );

  const sidebarUser =
    users && sidebarUserIdx >= 0 && sidebarUserIdx < users.length ? users[sidebarUserIdx] : null;

  const canGoPrevUser = sidebarUserIdx > 0;
  const canGoNextUser = users && sidebarUserIdx < users.length - 1;
  const goPrevUser = () => {
    setSidebarUserIdx((prevIdx) => prevIdx - 1);
  };
  const goNextUser = () => {
    setSidebarUserIdx((prevIdx) => prevIdx + 1);
  };

  const loadFilterOptions = useCallback(async () => {
    if (!firebaseUser) return;

    try {
      const token = await firebaseUser.getIdToken();
      const response = await getFilterOptions(
        token,
        search,
        adminsView ? true : "",
        directoryOnly ? (activeTab === "Approved" ? true : "pending") : "",
      );
      if (response.success) {
        setFilterOptions(response.data);
      } else {
        setErrorMessage(`Failed to fetch filter options: ${response.error}`);
      }
    } catch (error) {
      setErrorMessage(`Failed to fetch filer options: ${String(error)}`);
    }
  }, [adminsView, firebaseUser, search, directoryOnly, activeTab]);

  const loadUsers = useCallback(async () => {
    if (!firebaseUser) return;

    setErrorMessage("");
    try {
      const token = await firebaseUser.getIdToken();
      const response = await getMultipleUsers(
        token,
        sort,
        search,
        page,
        adminsView ? true : "",
        directoryOnly ? (activeTab === "Approved" ? true : "pending") : "",
        USERS_PAGE_SIZE,
        activeFilters,
      );
      if (response.success) {
        setUsers(response.data.users);
        setNumPages(Math.ceil(response.data.count / USERS_PAGE_SIZE));
      } else {
        setErrorMessage(`Failed to fetch users: ${response.error}`);
      }
    } catch (error) {
      setErrorMessage(`Failed to fetch users: ${String(error)}`);
    }
  }, [adminsView, firebaseUser, search, sort, page, directoryOnly, activeTab, activeFilters]);

  useEffect(() => {
    if (!users) return;

    // Don't select any invisible rows
    const visibleUserIds = new Set<string>();
    for (const user of users) {
      visibleUserIds.add(user._id);
    }
    setRowSelection((prevSelection) =>
      Object.entries(prevSelection).reduce<Record<string, boolean>>(
        (prev, [userId, visible]) => ({
          ...prev,
          cur: visibleUserIds.has(userId) ? visible : false,
        }),
        {},
      ),
    );

    if (sidebarUser === null || !visibleUserIds.has(sidebarUser._id)) {
      setSidebarUserIdx(-1);
    }
  }, [users, sidebarUser]);

  useEffect(() => {
    void loadUsers();
  }, [firebaseUser, search, sort, page, directoryOnly, activeTab, loadUsers]);

  useEffect(() => {
    void loadFilterOptions();
  }, [firebaseUser, search, directoryOnly, activeTab, loadFilterOptions]);

  // Sync editingFilters with activeFilters when filter sidebar opens
  useEffect(() => {
    if (isFilterOpen) {
      setEditingFilters(activeFilters);
    }
  }, [isFilterOpen, activeFilters]);

  // Capitalize first letter for display
  const formatFilterCategory = (category: string) => {
    return category.charAt(0).toUpperCase() + category.slice(1);
  };

  // Convert backend filter values to human-readable labels
  const formatFilterValue = useCallback((category: string, value: string): string => {
    switch (category) {
      case "title":
        return professionalTitleOptions.find((opt) => opt.value === value)?.label ?? value;
      case "membership":
        return membershipDisplayMap[value] ?? value;
      case "education":
        return degreesToReadable[value as keyof typeof degreesToReadable];
      case "services":
        return serviceKeyToLabelMap[value as keyof typeof serviceKeyToLabelMap] ?? value;
      case "location":
        return getCountryLabelFromCode(value) ?? value;
      default:
        return value;
    }
  }, []);

  const handleFilterChange = useCallback((category: string, value: string) => {
    setEditingFilters((prev) => {
      const current = prev[category] || [];
      const newSelection = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value];
      return { ...prev, [category]: newSelection };
    });
  }, []);

  const applyFilters = useCallback(() => {
    setActiveFilters(editingFilters);
    setIsFilterOpen(false);
  }, [editingFilters]);

  const resetFilters = useCallback(() => {
    setEditingFilters({});
    setActiveFilters({});
    setIsFilterOpen(false);
  }, []);

  const renderHeader = (fieldName: string, humanReadableName: string) => (
    <div
      className="flex flex-row gap-3 cursor-pointer"
      onClick={() => {
        setSort((prevSort) => (prevSort === `-${fieldName}` ? fieldName : `-${fieldName}`));
      }}
    >
      {humanReadableName}
      <div className="flex flex-col">
        <Icon
          name="ic_caretfill_up"
          fill={sort === fieldName ? "white" : "gray"}
          stroke="transparent"
          size={8}
        />
        <Icon
          name="ic_caretfill_down"
          fill={sort === `-${fieldName}` ? "white" : "gray"}
          stroke="transparent"
          size={8}
        />
      </div>
    </div>
  );

  const renderClickableCell = (index: number, content: ReactNode) => {
    return (
      <div
        className="w-full h-full cursor-pointer"
        onClick={() => {
          setSidebarUserIdx(index);
        }}
      >
        {content ?? "None"}
      </div>
    );
  };

  const entityName = adminsView ? "Admins" : "Members";

  return (
    <div className={styles.root}>
      <h1 className={styles.title}>Manage {entityName}</h1>
      {/* Controls */}
      <div className={styles.controls}>
        {adminsView ? null : (
          <div className={styles.directoryToggleContainer}>
            <button
              onClick={() => {
                setDirectoryOnly(false);
              }}
              className={`${styles.directoryToggleButton} ${directoryOnly ? "" : styles.directoryToggleButtonActive}`}
            >
              All Members
            </button>
            <button
              onClick={() => {
                setDirectoryOnly(true);
              }}
              className={`${styles.directoryToggleButton} ${directoryOnly ? styles.directoryToggleButtonActive : ""}`}
            >
              Directory
            </button>
          </div>
        )}

        <div className={styles.searchContainer}>
          <Image src="/icons/search.svg" alt="Search icon" width={27} height={16} />
          <input
            type="text"
            placeholder={`Search ${entityName}`}
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
            }}
            className={styles.searchBar}
          />
        </div>
        {directoryOnly && activeTab === "Pending" && selectedUsers.length > 0 ? (
          <>
            <button
              onClick={() => {
                setDenyingMembers(selectedUsers);
              }}
              className={styles["action-button"]}
            >
              Deny
              <Image
                src="/icons/ExitButton.svg"
                alt="Collapse"
                width={14}
                height={14}
                className={styles["small-icon"]}
              />
            </button>
            <button
              onClick={() => {
                setApprovingMembers(selectedUsers);
              }}
              className={styles["dark-action-button"]}
            >
              Approve
              <Image
                src="/white_check.svg"
                alt="Checkmark"
                width={12}
                height={12}
                className={styles["small-icon"]}
              />
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => {
                setIsFilterOpen((prevOpen) => !prevOpen);
              }}
              className={styles["action-button"]}
            >
              Filter
              <Image
                src="/icons/filter.svg"
                alt="Filter icon"
                width={20}
                height={20}
                className={styles["button-icon"]}
              />
            </button>
          </>
        )}
        {adminsView &&
          (selectedUsers.length > 0 ? (
            <button
              onClick={() => {
                setRemovingAdmins(selectedUsers);
              }}
              className={styles["red-action-button"]}
            >
              Remove {selectedUsers.length > 0 ? `(${String(selectedUsers.length)})` : "All"}
              <Image
                src="/icons/ExitButton.svg"
                alt="Collapse"
                width={20}
                height={20}
                className={styles["button-icon"]}
              />
            </button>
          ) : (
            <button
              className={styles["dark-action-button"]}
              onClick={() => {
                setIsInviteModalOpen(true);
              }}
            >
              Invite Admin
              <Image
                src="/icons/plus.svg"
                alt="Plus icon"
                width={16}
                height={16}
                className={styles["button-icon"]}
              />
            </button>
          ))}
        <button
          onClick={() => {
            // TODO: download as CSV
            // downloadCSV();
          }}
          className={styles["action-button"]}
        >
          Download {selectedUsers.length > 0 ? `(${String(selectedUsers.length)})` : "All"}
          <Image
            src="/icons/download.svg"
            alt="Download icon"
            width={20}
            height={20}
            className={styles["button-icon"]}
          />
        </button>
      </div>

      {directoryOnly && (
        <Tabs
          tabs={["Approved", "Pending"]}
          activeTab={activeTab}
          onActiveTabChange={setActiveTab}
        />
      )}

      {/* Filter Panel */}
      <div
        className={`${styles["filter-sidebar"]} ${isFilterOpen || sidebarUser !== null ? styles.open : ""}`}
      >
        <button
          className={styles.closeButton}
          onClick={() => {
            setIsFilterOpen(false);
            setSidebarUserIdx(-1);
          }}
        >
          <Image src="/icons/ExitButton.svg" alt="Collapse" width={24} height={24} />
        </button>

        {sidebarUser !== null ? (
          <div className="flex flex-col gap-6">
            <div className="flex flex-row gap-4">
              <ChevronLeft
                className={canGoPrevUser ? "cursor-pointer" : ""}
                onClick={() => {
                  if (canGoPrevUser) {
                    goPrevUser();
                  }
                }}
              />
              <ChevronRight
                className={canGoNextUser ? "cursor-pointer" : ""}
                onClick={() => {
                  if (canGoNextUser) {
                    goNextUser();
                  }
                }}
              />
            </div>
            <div className="flex flex-row gap-8 items-center">
              <ProfilePicture user={sidebarUser} size="large" />
              <div className="flex flex-col gap-1">
                <p className="font-bold text-2xl">{formatUserFullName(sidebarUser)}</p>
                <p className="text-base">{membershipDisplayMap[sidebarUser.account.membership]}</p>
                <p className={styles.fieldLabel}>
                  {sidebarUser?.role
                    ? sidebarUser.role[0].toUpperCase() + sidebarUser.role.substring(1)
                    : t("none")}
                </p>
              </div>
            </div>
            <Tabs
              tabs={["Information", "Directory Responses"]}
              activeTab={sidebarTab}
              onActiveTabChange={setSidebarTab}
            />

            {sidebarTab === "Information" ? (
              <div className="flex flex-col gap-6">
                {/* Basic Info */}
                <div className="flex flex-col gap-3">
                  <h3 className="font-semibold text-lg">Basic Information</h3>
                  <div className="flex flex-col gap-3">
                    <div className="flex flex-col">
                      <span className={styles.fieldLabel}>First Name</span>
                      <span>{sidebarUser.personal.firstName ?? t("none")}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className={styles.fieldLabel}>Last Name</span>
                      <span>{sidebarUser.personal.lastName ?? t("none")}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className={styles.fieldLabel}>Email</span>
                      <span>{sidebarUser.personal.email ?? t("none")}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className={styles.fieldLabel}>Phone</span>
                      <span>{sidebarUser.personal.phone ?? t("none")}</span>
                    </div>
                  </div>
                </div>

                {/* Professional Info */}
                <div className="flex flex-col gap-3">
                  <h3 className="font-semibold text-lg">Professional Information</h3>
                  <div className="flex flex-col gap-3">
                    <div className="flex flex-col">
                      <span className={styles.fieldLabel}>Title</span>
                      <span>
                        {professionalTitleOptions.find(
                          (option) => option.value === sidebarUser.professional?.title,
                        )?.label ?? `Other (${String(sidebarUser.professional?.title)})`}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className={styles.fieldLabel}>Country</span>
                      <span>{sidebarUser.professional?.country ?? t("none")}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className={styles.fieldLabel}>Languages</span>
                      <PreferredLanguages languages={sidebarUser.professional?.prefLanguages} />
                    </div>
                    <div className="flex flex-col">
                      <span className={styles.fieldLabel}>In Directory</span>
                      <span>
                        {sidebarUser.account.inDirectory === true
                          ? t("yes")
                          : sidebarUser.account.inDirectory === "pending"
                            ? "Pending"
                            : t("no")}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Student Info */}
                {sidebarUser.account.membership === "student" && (
                  <div className="flex flex-col gap-3">
                    <h3 className="font-semibold text-lg">Student Information</h3>
                    <div className="flex flex-col gap-3">
                      <div className="flex flex-col">
                        <span className={styles.fieldLabel}>School Country</span>
                        <span>
                          {getCountryLabelFromCode(sidebarUser.education?.schoolCountry) ??
                            t("none")}
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <span className={styles.fieldLabel}>School Name</span>
                        <span>{sidebarUser.education?.institution ?? t("none")}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className={styles.fieldLabel}>University Email</span>
                        <span>{sidebarUser.education?.email ?? t("none")}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className={styles.fieldLabel}>Degree</span>
                        <span>
                          {degreesToReadable[sidebarUser.education?.degree ?? ""] ?? "Other"}
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <span className={styles.fieldLabel}>Program</span>
                        <span>{sidebarUser.education?.program ?? t("none")}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className={styles.fieldLabel}>Graduation Date</span>
                        <span>{sidebarUser.education?.gradDate ?? t("none")}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Associate Info */}
                {sidebarUser.account.membership === "associate" && (
                  <div className="flex flex-col gap-3">
                    <h3 className="font-semibold text-lg">Associate Information</h3>
                    <div className="flex flex-col gap-3">
                      <div className="flex flex-col">
                        <span className={styles.fieldLabel}>Job Title</span>
                        <span>{sidebarUser.associate?.title ?? t("none")}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className={styles.fieldLabel}>Specializations</span>
                        <span>
                          {sidebarUser.associate?.specialization
                            ?.map((s) => SPECIALIZATIONS.find((spec) => spec.toLowerCase() === s))
                            .filter(Boolean)
                            .join(", ") ?? t("none")}
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <span className={styles.fieldLabel}>Organization Representative</span>
                        <span>{sidebarUser.associate?.organization ? "Yes" : "No"}</span>
                      </div>
                      {sidebarUser.associate?.organization && (
                        <div className="flex flex-col">
                          <span className={styles.fieldLabel}>Organization</span>
                          <span>{sidebarUser.associate.organization}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col gap-6">
                {sidebarUser.account.inDirectory === true ? (
                  <>
                    {/* Personal Info */}
                    <div className="flex flex-col gap-3">
                      <h3 className="font-semibold text-lg">Personal Information</h3>
                      <div className="flex flex-col gap-3">
                        <div className="flex flex-col">
                          <span className={styles.fieldLabel}>Degree/Certification</span>
                          <span>
                            {educationTypeOptions.find(
                              (option) => option.value === sidebarUser.education?.degree,
                            )?.label ?? t("none")}
                          </span>
                        </div>
                        <div className="flex flex-col">
                          <span className={styles.fieldLabel}>Institution</span>
                          <span>{sidebarUser.education?.institution ?? t("none")}</span>
                        </div>
                        <div className="flex flex-col">
                          <span className={styles.fieldLabel}>Work Clinic</span>
                          <span>{sidebarUser.clinic?.name ?? t("none")}</span>
                        </div>
                        <div className="flex flex-col">
                          <span className={styles.fieldLabel}>Clinic Website</span>
                          <span>{sidebarUser.clinic?.url ?? t("none")}</span>
                        </div>
                        {sidebarUser.clinic?.location && (
                          <div className="flex flex-col">
                            <span className={styles.fieldLabel}>Clinic Address</span>
                            <div className="text-sm">
                              {sidebarUser.clinic.location.address && (
                                <p>{sidebarUser.clinic.location.address}</p>
                              )}
                              {sidebarUser.clinic.location.suite && (
                                <p>{sidebarUser.clinic.location.suite}</p>
                              )}
                              <p>
                                {sidebarUser.clinic.location.city},{" "}
                                {sidebarUser.clinic.location.state},{" "}
                                {getCountryLabelFromCode(sidebarUser.clinic.location.country) ??
                                  sidebarUser.clinic.location.country}
                              </p>
                              <p>{sidebarUser.clinic.location.zipPostCode}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Display Info */}
                    <div className="flex flex-col gap-3">
                      <h3 className="font-semibold text-lg">Display Information</h3>
                      <div className="flex flex-col gap-3">
                        <div className="flex flex-col">
                          <span className={styles.fieldLabel}>Work Email</span>
                          <span>{sidebarUser.display?.workEmail ?? t("none")}</span>
                        </div>
                        <div className="flex flex-col">
                          <span className={styles.fieldLabel}>Work Phone</span>
                          <span>{sidebarUser.display?.workPhone ?? t("none")}</span>
                        </div>
                        <div className="flex flex-col">
                          <span className={styles.fieldLabel}>Genetic Services</span>
                          {(sidebarUser.display?.services?.length ?? 0) > 0 ? (
                            <div className="text-sm">
                              {sidebarUser.display?.services?.map((service) => (
                                <p key={service}>{specialtyOptionsToFrontend[service]}</p>
                              ))}
                            </div>
                          ) : (
                            <span>{t("none")}</span>
                          )}
                        </div>
                        <div className="flex flex-col">
                          <span className={styles.fieldLabel}>Languages</span>
                          <PreferredLanguages languages={sidebarUser.display?.languages} />
                        </div>
                        <div className="flex flex-col">
                          <span className={styles.fieldLabel}>License Number</span>
                          <span>
                            {sidebarUser.display?.license?.[0]
                              ? sidebarUser.display?.license?.[0]
                              : t("none")}
                          </span>
                        </div>
                        <div className="flex flex-col">
                          <span className={styles.fieldLabel}>Remote Services</span>
                          <span>{sidebarUser.display?.options?.remote ? t("yes") : t("no")}</span>
                        </div>
                        <div className="flex flex-col">
                          <span className={styles.fieldLabel}>Authorized Care</span>
                          <span>
                            {sidebarUser.display?.options?.authorizedCare === "unsure"
                              ? "Unsure"
                              : sidebarUser.display?.options?.authorizedCare === true
                                ? t("yes")
                                : t("no")}
                          </span>
                        </div>
                        <div className="flex flex-col">
                          <span className={styles.fieldLabel}>Open to Requests</span>
                          <span>
                            {sidebarUser.display?.options?.openToRequests ? t("yes") : t("no")}
                          </span>
                        </div>
                        <div className="flex flex-col">
                          <span className={styles.fieldLabel}>Open to Appointments</span>
                          <span>
                            {sidebarUser.display?.options?.openToAppointments ? t("yes") : t("no")}
                          </span>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col gap-2 items-center justify-center py-8">
                    <p className="text-gray-600 text-center">
                      {sidebarUser.account.inDirectory === "pending"
                        ? "This user's directory application is pending"
                        : "This user is not in the SPLAGen Directory."}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Approve/Deny buttons for pending directory requests */}
            {sidebarUser.account.inDirectory === "pending" && (
              <div className="flex flex-row gap-6 mt-4 ml-auto mr-auto">
                <button
                  onClick={() => {
                    setDenyingMembers([sidebarUser]);
                  }}
                  className={styles["action-button"]}
                >
                  Deny
                  <Image
                    src="/icons/ExitButton.svg"
                    alt="Collapse"
                    width={14}
                    height={14}
                    className={styles["small-icon"]}
                  />
                </button>
                <button
                  onClick={() => {
                    setApprovingMembers([sidebarUser]);
                  }}
                  className={styles["dark-action-button"]}
                >
                  Approve
                  <Image
                    src="/white_check.svg"
                    alt="Checkmark"
                    width={12}
                    height={12}
                    className={styles["small-icon"]}
                  />
                </button>
              </div>
            )}
          </div>
        ) : (
          <>
            <h3 className={styles.filterTitle}>Filter By</h3>
            {Object.entries(filterOptions).map(([category, options]) => (
              <div key={category} className={styles["filter-category"]}>
                <h4>{formatFilterCategory(category)}</h4>
                {options.map((option: string) => (
                  <label key={option}>
                    <input
                      type="checkbox"
                      checked={editingFilters[category]?.includes(option) || false}
                      onChange={() => {
                        handleFilterChange(category, option);
                      }}
                    />
                    {formatFilterValue(category, option)}
                  </label>
                ))}
              </div>
            ))}
            <div className={styles["filter-actions"]}>
              <Button variant="secondary" onClick={resetFilters} label="Reset" />
              <Button onClick={applyFilters} label="Apply Filters" />
            </div>
          </>
        )}
      </div>

      {users && (
        <Table
          className={styles.membersTable}
          enableRowSelection
          enableSorting={false}
          enableMultiRowSelection
          enablePagination={false}
          enableGlobalFiltering={false}
          rowSelection={rowSelection}
          onRowSelectionChange={setRowSelection}
          data={users}
          columns={[
            {
              id: "Name",
              header: () => renderHeader("name", "Name"),
              cell: (cell) => {
                const user = cell.row.original;
                return renderClickableCell(cell.row.index, formatUserFullName(user));
              },
            },
            {
              id: "Title",
              header: () => renderHeader("title", "Title"),
              cell: (cell) => {
                const user = cell.row.original;
                return renderClickableCell(
                  cell.row.index,
                  professionalTitleOptions.find(
                    (option) => option.value === user.professional?.title,
                  )?.label,
                );
              },
            },
            {
              id: "Membership",
              header: () => renderHeader("membership", "Membership"),
              cell: (cell) => {
                const user = cell.row.original;
                return renderClickableCell(
                  cell.row.index,
                  membershipDisplayMap[user.account.membership],
                );
              },
            },
            {
              id: "Location",
              header: () => renderHeader("location", "Location"),
              cell: (cell) => {
                const user = cell.row.original;
                return renderClickableCell(cell.row.index, user.clinic?.location?.country);
              },
            },
            {
              header: "Languages",
              cell: (cell) => {
                const user = cell.row.original;
                return renderClickableCell(
                  cell.row.index,
                  user.display?.languages?.length === 0 ? (
                    "None"
                  ) : (
                    <div className={styles.chipsRow}>
                      {user.display?.languages
                        ?.slice(0, 2)
                        .map((language) => (
                          <Chip
                            key={language}
                            text={t(language)}
                            color={languageColors[language]}
                          />
                        ))}
                      {(user.display?.languages?.length ?? 0) > 2 && (
                        <div className={styles.moreChipRoot}>
                          <p className={styles.moreChipText}>
                            + {(user.display?.languages?.length ?? 2) - 2}
                          </p>
                        </div>
                      )}
                    </div>
                  ),
                );
              },
            },
            {
              header: "Services",
              cell: (cell) => {
                const user = cell.row.original;
                return renderClickableCell(
                  cell.row.index,
                  user.display?.services?.length === 0 ? (
                    "None"
                  ) : (
                    <div className={styles.chipsRow}>
                      {user.display?.services
                        ?.slice(0, 2)
                        .map((service) => (
                          <Chip
                            key={service}
                            text={specialtyOptionsToFrontend[service]}
                            color={serviceColors[service]}
                          />
                        ))}
                      {(user.display?.services?.length ?? 0) > 2 && (
                        <div className={styles.moreChipRoot}>
                          <p className={styles.moreChipText}>
                            + {(user.display?.services?.length ?? 2) - 2}
                          </p>
                        </div>
                      )}
                    </div>
                  ),
                );
              },
            },
            {
              id: "Date Joined",
              header: () => renderHeader("createdAt", "Date Joined"),
              cell: (cell) => {
                const user = cell.row.original;
                return renderClickableCell(
                  cell.row.index,
                  moment(user.createdAt).format("MMMM DD, YYYY"),
                );
              },
            },
          ]}
          getRowId={(user) => user._id}
        />
      )}

      {users && users.length === 0 && <p>No users found</p>}

      <Pagination currentPage={page} numPages={numPages} onPageChange={setPage} />
      {errorMessage && <div className="text-red-500">{errorMessage}</div>}

      <ApproveDirectoryRequestPopup
        isOpen={approvingMembers.length > 0}
        onApprove={() => {
          setApprovingMembers([]);
          void loadUsers();
        }}
        onCancel={() => {
          setApprovingMembers([]);
        }}
        users={approvingMembers}
      />
      <DenyDirectoryRequestPopup
        isOpen={denyingMembers.length > 0}
        onDeny={() => {
          setDenyingMembers([]);
          void loadUsers();
        }}
        onCancel={() => {
          setDenyingMembers([]);
        }}
        users={denyingMembers}
      />
      <RemoveAdminPopup
        isOpen={removingAdmins.length > 0}
        onRemove={() => {
          setRemovingAdmins([]);
          void loadUsers();
        }}
        onCancel={() => {
          setRemovingAdmins([]);
        }}
        users={removingAdmins}
      />
      <InviteAdminPopup
        isOpen={isInviteModalOpen}
        onClose={() => {
          setIsInviteModalOpen(false);
        }}
        onInviteAdmin={() => {
          setIsInviteModalOpen(false);
          void loadUsers();
        }}
      />
    </div>
  );
};
