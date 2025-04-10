export type CreateUserRequestBody = {
  //Don't need to pass the type=role
  password: string;
  account: {
    membership: "student" | "geneticCounselor" | "healthcareProvider" | "associate";
  };

  personal: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
  };

  professional?: {
    title?: string;
    prefLanguages?: ("english" | "spanish" | "portuguese" | "other")[];
    otherPrefLanguages?: string;
    country?: string;
  };

  education?: {
    degree?: "masters" | "diploma" | "fellowship" | "md" | "phd" | "other";
    program?: string;
    otherDegree?: string;
    institution?: string;
    email?: string;
    gradDate?: string;
  };
};

export type UserId = {
  //same as firebaseId
  uid: string;
};

export type EditUserPersonalInformationRequestBody = UserId & {
  newFirstName: string;
  newLastName: string;
  newEmail: string;
  newPhone: string;
};

export type EditUserProfessionalInformationRequestBody = UserId & {
  newTitle: string;
  newPrefLanguages: ("english" | "spanish" | "portuguese" | "other")[];
  newOtherPrefLanguages: string;
  newCountry: string;
};

export type EditDirectoryPersonalInformationRequestBody = UserId & {
  newDegree: string;
  newEducationInstitution: string;
  newClinicName: string;
  newClinicAddress: string;
  newClinicCountry: string;
  newClinicApartmentSuite?: string;
  newClinicCity?: string;
  newClinicState?: string;
  newClinicZipPostCode?: string;
  newClinicWebsiteUrl: string;
};

export type EditDirectoryDisplayInformationRequestBody = UserId & {
  newWorkEmail: string;
  newWorkPhone: string;
  newServices: (
    | "pediatrics"
    | "cardiovascular"
    | "neurogenetics"
    | "rareDiseases"
    | "cancer"
    | "biochemical"
    | "prenatal"
    | "adult"
    | "psychiatric"
    | "reproductive"
    | "ophthalmic"
    | "research"
    | "pharmacogenomics"
    | "metabolic"
    | "other"
  )[];
  newLanguages: ("english" | "spanish" | "portuguese" | "other")[];
  newLicense: string[];
  newRemoteOption: boolean;
  newRequestOption: boolean;
};
