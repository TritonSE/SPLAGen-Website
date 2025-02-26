import { GlobalState, createStore } from "little-state-machine";

const initialState: GlobalState = {
  onboardingForm: {
    professionalTitle: "",
    country: "",
    languages: [],
  },
  directoryForm: {
    field: "",
  },
};

createStore(initialState);
