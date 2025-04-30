import { APIResult, get, handleAPIError, put } from "./requests";
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
  title: string;
  prefLanguages: ("english" | "spanish" | "portuguese" | "other")[];
  otherPrefLanguages: string;
  country: string;
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

// get professional info
export const getProfInfo = async (firebaseToken: string): Promise<APIResult<ProfessionalInfo>> => {
  try {
    const response = await get(
      "/api/users/general/professional-information",
      createAuthHeader(firebaseToken),
    );
    const data = (await response.json()) as ProfessionalInfo;
    console.log(data);

    return { success: true, data };
  } catch (error) {
    return handleAPIError(error);
  }
};

export async function editProfessionalInfoRequest(
  professionalInfo: ProfessionalInfo,
  firebaseToken: string,
): Promise<APIResult<null>> {
  try {
    console.log(" tried to put this info: ");
    console.log(professionalInfo);

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

type ModalProfInfoType = {
  professionalTitle: string;
  country: { value: string; label: string };
  languages: string[];
  splagenDirectory: boolean;
};

export const fetchCombinedProfInfo = async (
  firebaseToken: string,
): Promise<ModalProfInfoType | null> => {
  const [profRes, whoamiRes] = await Promise.all([
    getProfInfo(firebaseToken),
    getWhoAmI(firebaseToken),
  ]);

  if (!profRes.success || !whoamiRes.success || !profRes.data || !whoamiRes.data) {
    return null; // handle error appropriately
  }

  const profData = profRes.data;
  const userData = whoamiRes.data;

  return {
    professionalTitle: profData.title,
    country: {
      value: profData.country,
      label: profData.country, // adjust if you want custom label logic
    },
    languages: profData.prefLanguages,
    splagenDirectory: Boolean(userData.account.inDirectory),
  };
};
