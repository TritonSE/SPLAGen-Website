import { CountryOption, ProfessionalTitleOption } from "@/components";

export type onboardingState = {
  data: {
    // Signup
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    // Basic
    professionalTitle: ProfessionalTitleOption;
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

export type directoryState = {
  data: {
    educationType: string;
    educationInstitution: string;
    workClinic: string;
    clinicWebsite: string;
    clinicCountry: CountryOption;
    addressLine1: string;
    addressLine2: string;
    city: string;
    state: string;
    postcode: string;
    canMakeAppointments: boolean | undefined;
    canRequestTests: boolean | undefined;
    offersTelehealth: boolean | undefined;
    specialtyServices: string[];
    careLanguages: string[];
    authorizedForLanguages: boolean | string | undefined;
    email: string;
    phone: string;
    licenseType: "has_license" | "no_license" | undefined;
    licenseNumber: string;
    noLicenseReason: string;
    additionalComments: string;
  };
};
