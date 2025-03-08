import "little-state-machine";

declare module "little-state-machine" {
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  interface GlobalState {
    onboardingForm: {
      professionalTitle: string;
      country: string;
      field1: string;
    };
    directoryForm: {
      field: string;
    };
  }
}
