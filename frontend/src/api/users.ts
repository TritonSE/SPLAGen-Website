import { APIResult, get, handleAPIError, post, put } from "./requests";
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
  account: {
    inDirectory: boolean | string;
    profilePicture: string;
    membership: "student" | "geneticCounselor" | "healthcareProvider" | "associate";
  };
};

export type BasicInfo = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
};

export type ProfessionalInfo = {
  profTitle: string;
  country: string;
  languages: string;
  inDirectory: boolean;
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

export async function updateBasicInfoRequest(
  basicInfo: BasicInfo,
  firebaseToken: string,
): Promise<APIResult<null>> {
  try {
    // Use PUT instead of POST
    await put("/api/users/personal-information", basicInfo, createAuthHeader(firebaseToken));
    return { success: true, data: null };
  } catch (error) {
    return handleAPIError(error);
  }
}

export async function editProfessionalInfoRequest(
  professionalInfo: ProfessionalInfo,
  firebaseToken: string,
): Promise<APIResult<null>> {
  try {
    await post(
      "/api/users/professional-information",
      professionalInfo,
      createAuthHeader(firebaseToken),
    );
    return { success: true, data: null };
  } catch (error) {
    return handleAPIError(error);
  }
}
