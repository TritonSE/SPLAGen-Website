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
    country: { value: "", label: "" },
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
    educationType: "",
    educationInstitution: "",
    workClinic: "",
    clinicWebsite: "",
    clinicCountry: { value: "", label: "" },
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    postcode: "",
  },
};

createStore(initialState);
