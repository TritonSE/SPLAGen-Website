import { APIResult, get, handleAPIError, put } from "./requests";

// import { User as FirebaseUser } from "firebase/auth";

// Need to define user type based on user model
// export type User = {
//   _id: string;
//   firebaseId: string;
//   role: "member" | "admin" | "superadmin";
//   personal: {
//     firstName: string;
//     lastName: string;
//     email: string;
//     phone?: string;
//   };
//   account: {
//     inDirectory: boolean | string;
//     profilePicture: string;
//     membership: "student" | "geneticCounselor" | "healthcareProvider" | "associate";
//   };
// };

export type User = {
  _id: string;
  firebaseId: string;
  role: "superadmin" | "admin" | "member";
  account: {
    inDirectory: true | false | "pending";
    profilePicture: string;
    membership: "student" | "geneticCounselor" | "healthcareProvider" | "associate";
  };
  personal: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
  };
  professional: {
    title?: string;
    prefLanguages?: ("english" | "spanish" | "portuguese" | "other")[];
    otherPrefLanguages?: string;
    country?: string;
  };
  education: {
    degree?: "masters" | "diploma" | "fellowship" | "md" | "phd" | "other";
    program?: string;
    otherDegree?: string;
    institution?: string;
    email?: string;
    gradDate?: string;
  };
  associate: {
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
  clinic: {
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
  display: {
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
    options: {
      openToAppointments: boolean;
      openToRequests: boolean;
      remote: boolean;
      authorizedCare: true | false | "unsure";
    };
    comments?: {
      noLicense?: string;
      additional?: string;
    };
  };
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
