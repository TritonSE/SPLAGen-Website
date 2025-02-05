import { User as FirebaseUser } from "firebase/auth";

import { APIResult, get, handleAPIError } from "@/api/requests";

// Need to define user type based on user model
export interface User {}

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
