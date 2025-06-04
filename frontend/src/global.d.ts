import "little-state-machine";
import { CountryOption, ProfessionalTitleOption } from "./components";

declare module "little-state-machine" {
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  interface GlobalState {
    onboardingForm: {
      // Signup
      firstName: string;
      lastName: string;
      email: string;
      password: string;
      // Basic
      professionalTitle: ProfessionalTitleOption;
      country: CountryOption;
      languages: string[]; // check all we need
      membership: string;
      // Associate specific
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
    directoryForm: {
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
      canMakeAppointments: boolean;
      canRequestTests: boolean;
      offersTelehealth: boolean;
      specialtyServices: string[];
      careLanguages: string[];
      authorizedForLanguages: boolean | string;
    };
  }
}
