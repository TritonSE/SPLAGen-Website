import { APIResult, get, handleAPIError, post } from "./requests";
// import { User as FirebaseUser } from "firebase/auth";

// Need to define user type based on user model
export type User = {
  _id: string;
  firebaseId: string;
  role: "member" | "admin" | "superadmin";
  personal: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
  };
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

// getWhoAmI with sample data
// Replace with actual code once database is in use
export const getWhoAmI = async (firebaseToken: string): Promise<APIResult<User>> => {
  try {
    const response = await get("/api/users/whoami", createAuthHeader(firebaseToken));
    const data = (await response.json()) as User;

    return { success: true, data };
  } catch (error) {
    return handleAPIError(error);
  }
};

export async function editBasicInfoRequest(
  basicInfo: BasicInfo,
  firebaseToken: string,
): Promise<APIResult<null>> {
  try {
    //TODO: API result return type needs be updated when route written
    await post("/api/users/personal-information", basicInfo, createAuthHeader(firebaseToken));
    return { success: true, data: null };
  } catch (error) {
    return handleAPIError(error);
  }
}
