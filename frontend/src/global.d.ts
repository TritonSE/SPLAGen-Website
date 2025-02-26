import "little-state-machine";

declare module "little-state-machine" {
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  interface GlobalState {
    onboardingForm: {
      professionalTitle: string;
      country: string;
      languages: string[];
    };
    directoryForm: {
      field: string;
    };
  }
}
