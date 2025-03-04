import { CountryOption } from "@/components";

export type onboardingState = {
  data: {
    professionalTitle: string;
    country: CountryOption;
    languages: string[];
  };
};
