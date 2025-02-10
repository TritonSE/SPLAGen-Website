import "little-state-machine";

declare module "little-state-machine" {
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  interface GlobalState {
    data: {
      professionalTitle: string;
      country: string;
      field1: string;
    };
  }
}
