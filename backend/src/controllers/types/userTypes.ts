export type CreateUserRequestBody = {
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
    prefLanguage?: "english" | "spanish" | "portuguese" | "other";
    otherPrefLanguage?: string;
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

  associate?: {
    title?: string;
    specialization?: string[];
    organization?: string;
  };
};

export type EditUserPersonalInformationRequestBody = {
  newFirstName: string;
  newLastName: string;
  newEmail: string;
  newPhone?: string;
};

export type EditUserProfessionalInformationRequestBody = {
  newTitle: string;
  newPrefLanguage: "english" | "spanish" | "portuguese" | "other";
  newOtherPrefLanguage: string;
  newCountry: string;
};

export type EditDirectoryPersonalInformationRequestBody = {
  newDegree: string;
  newEducationInstitution: string;
  newClinicName?: string;
  newClinicAddress?: string;
  newClinicCountry?: string;
  newClinicApartmentSuite?: string;
  newClinicCity?: string;
  newClinicState?: string;
  newClinicZipPostCode?: string;
  newClinicWebsiteUrl?: string;
};

export type EditDirectoryDisplayInformationRequestBody = {
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
  newAppointmentsOption: boolean;
  newAuthorizedOption: string | boolean;
};

export type EditProfilePictureRequestBody = {
  profilePicture: string;
};

export type ExportUsersRequestBody = {
  userIds?: string[];
  search?: string;
  isAdmin?: string;
  inDirectory?: string;
  title?: string[];
  membership?: string[];
  education?: string[];
  services?: string[];
  country?: string[];
};
