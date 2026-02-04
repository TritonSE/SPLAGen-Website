import { getAuth, sendPasswordResetEmail, signInWithEmailAndPassword } from "firebase/auth";

import { APIResult, get, handleAPIError, post, put } from "./requests";

import type { UserCredential } from "firebase/auth";

import { initFirebase } from "@/firebase/firebase";

export type MembershipType = "student" | "geneticCounselor" | "healthcareProvider" | "associate";

export const membershipDisplayMap: Record<string, string> = {
  student: "Student",
  geneticCounselor: "Genetic Counselor",
  healthcareProvider: "Healthcare Provider",
  associate: "Associate",
};

export const professionalTitleOptions = [
  { value: "medical_geneticist", label: "Medical Geneticist" },
  { value: "genetic_counselor", label: "Genetic Counselor" },
  { value: "student", label: "Student" },
  { value: "other", label: "Other" },
] as const;

// Define CreateUserRequestBody type based on backend requirements
export type CreateUserRequestBody = {
  password: string;
  account: {
    membership: MembershipType;
  };
  personal: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
  };
  professional?: {
    title?: string;
    prefLanguages?: ("english" | "spanish" | "portuguese" | "other")[];
    otherPrefLanguages?: string;
    country?: string;
  };
  education?: {
    degree?: "masters" | "diploma" | "fellowship" | "md" | "phd" | "other";
    program?: string;
    otherDegree?: string;
    institution?: string;
    email?: string;
    gradDate?: string;
    schoolCountry?: string;
  };
  associate?: {
    title?: string;
    specialization?: string[];
    organization?: string;
  };
};

// Need to define user type based on user model
export type User = {
  _id: string;
  firebaseId: string;
  role: "member" | "admin" | "superadmin";
  account: {
    inDirectory: boolean | "pending";
    profilePicture?: string;
    membership: MembershipType;
  };
  personal: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
  };
  professional?: {
    title?: string;
    prefLanguages?: ("english" | "spanish" | "portuguese" | "other")[];
    otherPrefLanguages?: string;
    country?: string;
  };
  education?: {
    degree?: "masters" | "diploma" | "fellowship" | "md" | "phd" | "other";
    program?: string;
    otherDegree?: string;
    institution?: string;
    email?: string;
    gradDate?: string;
    schoolCountry?: string;
  };
  associate?: {
    title?: string;
    specialization?: (
      | "rare disease advocacy"
      | "research"
      | "public health"
      | "bioethics"
      | "law"
      | "biology"
      | "medical writer"
      | "medical science liason"
      | "laboratory scientist"
      | "professor"
      | "bioinformatics"
      | "biotech sales and marketing"
    )[];
    organization?: string;
  };
  clinic?: {
    name?: string;
    url?: string;
    location?: {
      country?: string;
      address?: string;
      suite?: string;
      city?: string;
      state?: string;
      zipPostCode?: string;
    };
  };
  display?: {
    workEmail?: string;
    workPhone?: string;
    services?: (
      | "pediatrics"
      | "cardiovascular"
      | "neurogenetics"
      | "rareDiseases"
      | "cancer"
      | "biochemical"
      | "prenatal"
      | "adult"
      | "psychiatric"
      | "reproductive"
      | "ophthalmic"
      | "research"
      | "pharmacogenomics"
      | "metabolic"
      | "other"
    )[];
    languages?: ("english" | "spanish" | "portuguese" | "other")[];
    license?: string[];
    options?: {
      openToAppointments?: boolean;
      openToRequests?: boolean;
      remote?: boolean;
      authorizedCare?: boolean | "unsure";
    };
    comments?: {
      noLicense?: string;
      additional?: string;
    };
  };
  createdAt: string;
  updatedAt: string;
};

export const formatUserFullName = (user: User) =>
  `${user.personal.firstName} ${user.personal.lastName}`;

export type PaginateUserResult = {
  users: User[];
  count: number;
};

export type EditBasicInfo = {
  newFirstName: string;
  newLastName: string;
  newEmail: string;
  newPhone?: string;
};

export type ProfessionalInfo = {
  title: string;
  prefLanguages: ("english" | "spanish" | "portuguese" | "other")[];
  otherPrefLanguages: string;
  country: string;
};

export type EditProfessionalInfo = {
  newTitle: string;
  newPrefLanguages: ("english" | "spanish" | "portuguese" | "other")[];
  newOtherPrefLanguages: string;
  newCountry: string;
};

export type EditDirectoryDisplayInformationRequestBody = {
  newWorkEmail: string;
  newWorkPhone: string;
  newServices: (
    | "pediatrics"
    | "cardiovascular"
    | "neurogenetics"
    | "rareDiseases"
    | "cancer"
    | "biochemical"
    | "prenatal"
    | "adult"
    | "psychiatric"
    | "reproductive"
    | "ophthalmic"
    | "research"
    | "pharmacogenomics"
    | "metabolic"
    | "other"
  )[];
  newLanguages: ("english" | "spanish" | "portuguese" | "other")[];
  newLicense: string[];
  newRemoteOption: boolean;
  newRequestOption: boolean;
  newAppointmentsOption: boolean;
  newAuthorizedOption: string | boolean;
};

export type EditDirectoryPersonalInformationRequestBody = {
  newDegree: string;
  newEducationInstitution: string;
  newClinicName?: string;
  newClinicAddress?: string;
  newClinicCountry?: string;
  newClinicApartmentSuite?: string;
  newClinicCity?: string;
  newClinicState?: string;
  newClinicZipPostCode?: string;
  newClinicWebsiteUrl?: string;
};

export const createAuthHeader = (firebaseToken: string) => ({
  Authorization: `Bearer ${firebaseToken}`,
});

/**
 * Get current user information from the backend
 * @param firebaseToken The Firebase authentication token
 * @returns API result with user data
 */
export const getWhoAmI = async (firebaseToken: string): Promise<APIResult<User>> => {
  try {
    const response = await get("/api/users/whoami", createAuthHeader(firebaseToken));
    const data = (await response.json()) as User;

    return { success: true, data };
  } catch (error) {
    return handleAPIError(error);
  }
};

/**
 * Signs up a new user with email and password using Firebase and the backend
 * @param userData User data to be registered
 * @returns API result with the created user data
 */
export const signUpUser = async (userData: CreateUserRequestBody): Promise<APIResult<User>> => {
  try {
    const response = await post("/api/users", userData);
    const data = (await response.json()) as User;
    return { success: true, data };
  } catch (error) {
    return handleAPIError(error);
  }
};

/**
 * Logs in a user with email and password using Firebase
 * @param email User email
 * @param password User password
 * @returns API result with the authenticated user's Firebase token
 */
export const loginUserWithEmailPassword = async (
  email: string,
  password: string,
): Promise<APIResult<{ token: string }>> => {
  const auth = getAuth();
  try {
    // Type-safe implementation
    const userCredential: UserCredential = await signInWithEmailAndPassword(auth, email, password);
    const firebaseUser = userCredential.user;

    if (!firebaseUser) {
      throw new Error("Authentication failed");
    }

    const token = await firebaseUser.getIdToken();
    if (!token) {
      throw new Error("Failed to get authentication token");
    }

    return { success: true, data: { token } };
  } catch (error) {
    return handleAPIError(error);
  }
};

export const resetUserPassword = async (email: string): Promise<APIResult<null>> => {
  const auth = getAuth();
  try {
    await sendPasswordResetEmail(auth, email);

    return { success: true, data: null };
  } catch (error) {
    return handleAPIError(error);
  }
};

/**
 * Logs out the current user from Firebase
 * @returns API result indicating success
 */
export const logoutUser = async (): Promise<APIResult<null>> => {
  try {
    const { auth } = initFirebase();
    await auth.signOut();
    return { success: true, data: null };
  } catch (error) {
    return handleAPIError(error);
  }
};

export const USERS_PAGE_SIZE = 20;

export const getMultipleUsers = async (
  firebaseToken: string,
  sort: string,
  search: string,
  page: number,
  isAdmin: boolean | "" = "",
  inDirectory: boolean | "pending" | "" = "",
  pageSize = USERS_PAGE_SIZE,
): Promise<APIResult<PaginateUserResult>> => {
  try {
    const response = await get(
      `/api/users?order=${sort}&search=${search}&page=${String(page)}&pageSize=${String(pageSize)}&isAdmin=${String(isAdmin)}&inDirectory=${String(inDirectory)}`,
      createAuthHeader(firebaseToken),
    );
    const data = (await response.json()) as PaginateUserResult;
    return { success: true, data };
  } catch (error) {
    return handleAPIError(error);
  }
};

export async function editBasicInfoRequest(
  basicInfo: EditBasicInfo,
  firebaseToken: string,
): Promise<APIResult<null>> {
  try {
    await put(
      "/api/users/general/personal-information",
      basicInfo,
      createAuthHeader(firebaseToken),
    );
    return { success: true, data: null };
  } catch (error) {
    return handleAPIError(error);
  }
}

export async function editProfessionalInfoRequest(
  professionalInfo: EditProfessionalInfo,
  firebaseToken: string,
): Promise<APIResult<null>> {
  try {
    await put(
      "/api/users/general/professional-information",
      professionalInfo,
      createAuthHeader(firebaseToken),
    );
    return { success: true, data: null };
  } catch (error) {
    return handleAPIError(error);
  }
}

export async function editDirectoryDisplayInfoRequest(
  directoryInfo: EditDirectoryDisplayInformationRequestBody,
  firebaseToken: string,
): Promise<APIResult<null>> {
  try {
    await put("/api/users/directory/display-info", directoryInfo, createAuthHeader(firebaseToken));
    return { success: true, data: null };
  } catch (error) {
    return handleAPIError(error);
  }
}

export async function editDirectoryPersonalInfoRequest(
  directoryInfo: EditDirectoryPersonalInformationRequestBody,
  firebaseToken: string,
): Promise<APIResult<null>> {
  try {
    await put(
      "/api/users/directory/personal-information",
      directoryInfo,
      createAuthHeader(firebaseToken),
    );
    return { success: true, data: null };
  } catch (error) {
    return handleAPIError(error);
  }
}

export async function editProfilePicture(
  profilePicture: string,
  firebaseToken: string,
): Promise<APIResult<null>> {
  try {
    await put(
      "/api/users/general/profile-picture",
      { profilePicture },
      createAuthHeader(firebaseToken),
    );
    return { success: true, data: null };
  } catch (error) {
    return handleAPIError(error);
  }
}

export async function updateStudentInfo(
  firebaseToken: string,
  studentInfo: {
    schoolCountry: string;
    schoolName: string;
    universityEmail: string;
    degree: string;
    programName: string;
    gradDate: string;
  },
): Promise<APIResult<null>> {
  try {
    await put(
      "/api/users/general/student-information",
      studentInfo,
      createAuthHeader(firebaseToken),
    );
    return { success: true, data: null };
  } catch (error) {
    return handleAPIError(error);
  }
}

export async function updateAssociateInfo(
  firebaseToken: string,
  associateInfo: {
    jobTitle: string;
    specialization: string[];
    isOrganizationRepresentative: string;
    organizationName: string;
  },
): Promise<APIResult<null>> {
  try {
    await put(
      "/api/users/general/associate-information",
      associateInfo,
      createAuthHeader(firebaseToken),
    );
    return { success: true, data: null };
  } catch (error) {
    return handleAPIError(error);
  }
}

export async function editMembership(
  newMembership: MembershipType,
  firebaseToken: string,
): Promise<APIResult<{ user: User; removedFromDirectory: boolean }>> {
  try {
    const response = await put(
      "/api/users/membership",
      { newMembership },
      createAuthHeader(firebaseToken),
    );
    const data = (await response.json()) as { user: User; removedFromDirectory: boolean };
    return { success: true, data };
  } catch (error) {
    return handleAPIError(error);
  }
}

export const getUser = async (
  firebaseUid: string,
  firebaseToken: string,
): Promise<APIResult<User>> => {
  try {
    const response = await get(`/api/users/${firebaseUid}`, createAuthHeader(firebaseToken));
    const data = (await response.json()) as User;
    return { success: true, data };
  } catch (error) {
    return handleAPIError(error);
  }
};
