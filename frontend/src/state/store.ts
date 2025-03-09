import { GlobalState, createStore } from "little-state-machine";

const initialState: GlobalState = {
  onboardingForm: {
    professionalTitle: "",
    country: "",
    field1: "",
  },
  directoryForm: {
    field: "",
  },
};

createStore(initialState);
