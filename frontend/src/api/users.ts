import { User as FirebaseUser } from "firebase/auth";

import { APIResult, get, handleAPIError, post, put } from "./requests";

import { initFirebase, loginUser } from "@/firebase/firebase";

// Define CreateUserRequestBody type based on backend requirements
export type CreateUserRequestBody = {
  password: string;
  account: {
    membership: "student" | "geneticCounselor" | "healthcareProvider" | "associate";
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
    membership: "student" | "geneticCounselor" | "healthcareProvider" | "associate";
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

export type UserWithFirebase = {
  firebaseUser: FirebaseUser;
  backendUser: User;
};

export type BasicInfo = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
};

export const createAuthHeader = (firebaseToken: string) => ({
  Authorization: `Bearer ${firebaseToken}`,
});

/**
 * Authenticates a user with the backend after Firebase authentication
 * @param firebaseToken The Firebase authentication token
 * @returns API result with user data
 */
export const authenticateUser = async (firebaseToken: string): Promise<APIResult<User>> => {
  try {
    const response = await post("/api/users/authenticate", {}, createAuthHeader(firebaseToken));
    const data = (await response.json()) as User;
    return { success: true, data };
  } catch (error) {
    return handleAPIError(error);
  }
};

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
  try {
    const firebaseUser = await loginUser(email, password);
    const token = await firebaseUser.getIdToken();
    return { success: true, data: { token } };
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
  basicInfo: BasicInfo,
  firebaseToken: string,
): Promise<APIResult<null>> {
  try {
    const body = {
      newFirstName: basicInfo.firstName,
      newLastName: basicInfo.lastName,
      newEmail: basicInfo.email,
      newPhone: basicInfo.phone,
    };

    await put("/api/users/personal-information", body, createAuthHeader(firebaseToken));
    return { success: true, data: null };
  } catch (error) {
    return handleAPIError(error);
  }
}
