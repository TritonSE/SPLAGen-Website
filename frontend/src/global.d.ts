import "little-state-machine";
import { CountryOption } from "./components";

declare module "little-state-machine" {
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  interface GlobalState {
    onboardingForm: {
      professionalTitle: string;
      country: CountryOption;
      languages: string[];
      accredited: boolean;
      advancedDegree: boolean;
      
    };
    directoryForm: {
      field: string;
    };
  }
}
