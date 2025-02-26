import { APIResult, handleAPIError } from "./requests";

// Need to define user type based on user model
export type User = {
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
};

export const getWhoAmI = async (firebaseToken: string): Promise<APIResult<User>> => {
  try {
    // Need to replace with api to get user
    const fakeUser: User = {
      _id: "id",
      firebaseId: firebaseToken,
      account: {
        type: "account_type",
        inDirectory: true,
        profilePicture: "pfp_url",
        membership: "membership",
      },
      personal: {
        firstName: "firstname",
        lastName: "lastname",
        email: "email",
        phone: "phone",
      },
      professional: {
        title: "title",
        prefLanguages: ["english"],
        otherPrefLanguages: "otherlanguages",
        country: "country",
      },
      education: {
        degree: "degree",
        program: "program",
        otherDegree: "otherdegree",
        institution: "institution",
        email: "eduemail",
        gradDate: "graddate",
      },
      clinic: {
        name: "clinic_name",
        url: "clinic_url",
        location: {
          country: "clinic_country",
          address: "clinic_address",
          suite: "clinic_suite",
        },
      },
      display: {
        workEmail: "work_email",
        workPhone: "work_phone",
        services: ["services"],
        languages: ["languages"],
        license: ["license"],
        options: {
          openToAppointments: true,
          openToRequests: true,
          remote: true,
        },
        comments: {
          noLicense: "",
          additional: "",
        },
      },
    };
    return { success: true, data: fakeUser };
  } catch (error) {
    return handleAPIError(error);
  }
};
