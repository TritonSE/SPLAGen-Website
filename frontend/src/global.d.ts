import "little-state-machine";
import { CountryOption } from "./components";

declare module "little-state-machine" {
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  interface GlobalState {
    onboardingForm: {
      professionalTitle: string;
      country: CountryOption;
      languages: string[]; // check all we need
      membership: string;
      // Associate specific
      specializations: string[];
      isOrganizationRepresentative: boolean;
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
