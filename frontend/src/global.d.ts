import "little-state-machine";
import { CountryOption, ProfessionalTitleOption } from "./components";

declare module "little-state-machine" {
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  interface GlobalState {
    onboardingForm: {
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
      field: string;
    };
  }
}
