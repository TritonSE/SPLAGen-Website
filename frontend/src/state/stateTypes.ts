import { CountryOption } from "@/components";

export type onboardingState = {
  data: {
    professionalTitle: string;
    country: CountryOption;
    languages: string[];
    membership: string;
    // Associate specific
    // see user modal
    specializations: string[];
    isOrganizationRepresentative: string;
    jobTitle: string;
    organizationName: string;
    // Student specific
    degree: string;
    schoolCountry: CountryOption;
    schoolName: string;
    universityEmail: string;
    programName: string;
    graduationDate: string;
  };
};
