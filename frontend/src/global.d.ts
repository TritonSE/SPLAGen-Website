import "little-state-machine";

declare module "little-state-machine" {
  interface GlobalState {
    data: {
      professionalTitle: string;
      country: string;
    };
  };
}
