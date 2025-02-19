import { User as FirebaseUser } from "firebase/auth";

import { APIResult, get, handleAPIError } from "@/api/requests";

interface Language {}

// Need to define user type based on user model
export interface User {
  _id: string;
  firebaseId: string;
  account: {
    type: string;
    inDirectory: boolean;
    profilePicture?: string;
    membership: string;
  };
  personal: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
  };
  professional?: {
    title?: string;
    prefLanguages?: string[];
    otherPrefLanguages?: string;
    country?: string;
  };
  education?: {
    degree?: string;
    program?: string;
    otherDegree?: string;
    institution?: string;
    email?: string;
    gradDate?: string;
  };
  clinic?: {
    name?: string;
    url?: string;
    location?: {
      country?: string;
      address?: string;
      suite?: string;
    };
  };
  display?: {
    workEmail?: string;
    workPhone?: string;
    services?: string[];
    languages?: string[];
    license?: string[];
    options?: {
      openToAppointments?: boolean;
      openToRequests?: boolean;
      remote?: boolean;
    };
    comments?: {
      noLicense?: string;
      additional?: string;
    };
  };
}

export const createAuthHeader = (firebaseToken: string) => ({
  Authorization: `Bearer ${firebaseToken}`,
});

export const getWhoAmI = async (firebaseToken: string): Promise<APIResult<User>> => {
  try {
    // Need to replace with api to get user
    const response = await get("/api/user/whoami", createAuthHeader(firebaseToken));
    const json = (await response.json()) as User;
    return { success: true, data: json };
  } catch (error) {
    return handleAPIError(error);
  }
};

export const getAllUsers = async(): Promise<APIResult<User[]>> {
    try {
        const response = await get(`/api/users`);
        const json = (await response.json()) as User[];
        return { success: true, data: json };
    } catch (error) {
        return handleAPIError(error);
    }
}
