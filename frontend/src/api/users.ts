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
      _id: "sample_id",
      firebaseId: firebaseToken,
      account: {
        type: "sample_account_type",
        inDirectory: true,
        profilePicture: "sample_account_profilePicture",
        membership: "sample_account_membership",
      },
      personal: {
        firstName: "sample_personal_firstName",
        lastName: "sample_personal_lastName",
        email: "sample_personal_email",
        phone: "sample_personal_phone",
      },
      professional: {
        title: "sample_professional_title",
        prefLanguages: ["sample_professional_prefLanguage1", "sample_professional_prefLanguage2"],
        otherPrefLanguages: "sample_professional_otherPrefLanguages",
        country: "sample_professional_country",
      },
      education: {
        degree: "sample_education_degree",
        program: "sample_education_program",
        otherDegree: "sample_education_otherDegree",
        institution: "sample_education_institution",
        email: "sample_education_email",
        gradDate: "sample_education_gradDate",
      },
      clinic: {
        name: "sample_clinic_name",
        url: "sample_clinic_url",
        location: {
          country: "sample_clinic_location_country",
          address: "sample_clinic_location_address",
          suite: "sample_clinic_location_suite",
        },
      },
      display: {
        workEmail: "sample_display_workEmail",
        workPhone: "sample_display_workPhone",
        services: ["sample_display_service1", "sample_display_service2"],
        languages: ["sample_display_language1", "sample_display_language2"],
        license: ["sample_display_license"],
        options: {
          openToAppointments: true,
          openToRequests: true,
          remote: true,
        },
        comments: {
          noLicense: "sample_display_comments_noLicense",
          additional: "sample_display_comments_additional",
        },
      },
    };
    return { success: true, data: fakeUser };
  } catch (error) {
    return handleAPIError(error);
  }
};
