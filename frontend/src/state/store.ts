import { GlobalState, createStore } from "little-state-machine";

const initialState: GlobalState = {
  onboardingForm: {
    // Signup
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    // Basic
    professionalTitle: { value: "", label: "" },
    country: { value: "", label: "" }, // how to make display default
    languages: [],
    membership: "",
    // Associate
    specializations: [],
    isOrganizationRepresentative: "",
    jobTitle: "",
    organizationName: "",
    // Student
    degree: "",
    schoolCountry: { value: "", label: "" },
    schoolName: "",
    universityEmail: "",
    programName: "",
    graduationDate: "",
  },
  directoryForm: {
    field: "",
  },
};

createStore(initialState);
