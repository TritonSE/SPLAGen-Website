import { GlobalState, createStore } from "little-state-machine";

const initialState: GlobalState = {
  onboardingForm: {
    professionalTitle: "",
    country: {value:"", label:""},
    languages: [],
  },
  directoryForm: {
    field: "",
  },
};

createStore(initialState);
