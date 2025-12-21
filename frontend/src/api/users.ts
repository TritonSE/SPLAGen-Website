import { getAuth, sendPasswordResetEmail, signInWithEmailAndPassword } from "firebase/auth";

import { APIResult, get, handleAPIError, post, put } from "./requests";

import type { UserCredential } from "firebase/auth";

import { initFirebase } from "@/firebase/firebase";

export type MembershipType = "student" | "geneticCounselor" | "healthcareProvider" | "associate";

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

export type EditBasicInfo = {
  newFirstName: string;
  newLastName: string;
  newEmail: string;
  newPhone: string;
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

export async function editBasicInfoRequest(
  basicInfo: EditBasicInfo,
  firebaseToken: string,
): Promise<APIResult<null>> {
  try {
    //TODO: API result return type needs be updated when route written
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
