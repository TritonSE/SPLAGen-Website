// TODO figure out how to fix this without ESLint disable
// eslint-disable-next-line import/no-unresolved
import { stringify } from "csv-stringify/sync";
import { NextFunction, Request, Response } from "express";

import { AuthenticatedRequest } from "../middleware/auth";
import UserModel from "../models/user";
import { firebaseAdminAuth } from "../util/firebase";
import { deleteUserFromFirebase, deleteUserFromMongoDB, getUserFromMongoDB } from "../util/user";
import { buildUserQuery } from "../util/userQuery";

import {
  CreateUserRequestBody,
  EditDirectoryDisplayInformationRequestBody,
  EditDirectoryPersonalInformationRequestBody,
  EditProfilePictureRequestBody,
  EditUserPersonalInformationRequestBody,
  EditUserProfessionalInformationRequestBody,
  ExportUsersRequestBody,
} from "./types/userTypes";

export const createUser = async (
  req: Request<unknown, unknown, CreateUserRequestBody>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { account, personal, professional, education, associate, password } = req.body;

    // Create user in Firebase
    const userRecord = await firebaseAdminAuth.createUser({
      email: personal.email,
      password,
    });

    // Create new user in MongoDB
    const newUser = await UserModel.create({
      firebaseId: userRecord.uid,
      role: "member",
      account: { ...account, inDirectory: false },
      personal,
      professional,
      education,
      associate,
    });

    res.status(201).json(newUser);
    return;
  } catch (error) {
    console.error("Error creating user:", error);
    next(error);
    return;
  }
};

export const getWhoAmI = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { firebaseUid } = req;
    const user = await UserModel.findOne({ firebaseId: firebaseUid });

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    res.status(200).json(user);
    return;
  } catch (error) {
    next(error);
    return;
  }
};

export const deleteUser = async (
  req: AuthenticatedRequest<{ firebaseId: string }>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { firebaseId } = req.params;

    // Delete user from Firebase and MongoDB
    await deleteUserFromFirebase(firebaseId);
    await deleteUserFromMongoDB(firebaseId);

    res.status(200).json({ message: "User deleted successfully" });
    return;
  } catch (error) {
    console.error("Error deleting user:", error);
    next(error);
    return;
  }
};

export const getFilterOptions = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const searchTerm = req.query.search;
    const isAdminFilter = req.query.isAdmin;
    const inDirectoryFilter = req.query.inDirectory;

    // Build base query using helper function
    const baseQuery = buildUserQuery({
      search: searchTerm as string | undefined,
      isAdmin: isAdminFilter as string | undefined,
      inDirectory: inDirectoryFilter as string | undefined,
    });

    // Get distinct values for each filter field
    const [titles, memberships, educations, services, countries] = await Promise.all([
      UserModel.distinct("professional.title", baseQuery),
      UserModel.distinct("account.membership", baseQuery),
      UserModel.distinct("education.degree", baseQuery),
      UserModel.distinct("display.services", baseQuery),
      UserModel.distinct("clinic.location.country", baseQuery),
    ]);

    const filterOptions = {
      title: titles.filter(Boolean),
      membership: memberships.filter(Boolean),
      education: educations.filter(Boolean),
      services: services.filter(Boolean),
      location: countries.filter(Boolean),
    };

    res.status(200).json(filterOptions);
  } catch (error) {
    console.error("Error getting filter options:", error);
    next(error);
  }
};

export const getUsers = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    // Search
    const searchTerm = req.query.search;

    // Pagination
    const page = parseInt(req.query.page as string);
    const pageSize = parseInt(req.query.pageSize as string);

    const isAdminFilter = req.query.isAdmin;
    const inDirectoryFilter = req.query.inDirectory;

    // Parse filter arrays from query strings
    const titleFilter = req.query.title ? (req.query.title as string).split(",") : undefined;
    const membershipFilter = req.query.membership
      ? (req.query.membership as string).split(",")
      : undefined;
    const educationFilter = req.query.education
      ? (req.query.education as string).split(",")
      : undefined;
    const servicesFilter = req.query.services
      ? (req.query.services as string).split(",")
      : undefined;
    const countryFilter = req.query.country ? (req.query.country as string).split(",") : undefined;

    // Sorting
    const sortParam = (req.query.order ?? "") as string;
    let isSortedDesc = sortParam?.length > 0 && sortParam.startsWith("-");
    const sortField = isSortedDesc ? sortParam.slice(1) : sortParam;

    const sortFieldsToDBFields: Record<string, string[]> = {
      name: ["personal.firstName", "personal.lastName"],
      title: ["professional.title"],
      membership: ["account.membership"],
      location: ["clinic.location.country"],
      languages: ["user.display.languages"],
      services: ["user.display.services"],
      createdAt: ["createdAt"],
    };
    let sortDBFields = sortFieldsToDBFields[sortField];

    if (!sortDBFields) {
      // Default to showing most recently joined users first
      sortDBFields = ["createdAt"];
      isSortedDesc = true;
    }

    // Build query using helper function
    const query = buildUserQuery({
      search: searchTerm as string | undefined,
      isAdmin: isAdminFilter as string | undefined,
      inDirectory: inDirectoryFilter as string | undefined,
      title: titleFilter,
      membership: membershipFilter,
      education: educationFilter,
      services: servicesFilter,
      country: countryFilter,
    });

    const total = await UserModel.countDocuments(query);

    const users = await UserModel.find(query)
      .sort(sortDBFields.reduce((prev, cur) => ({ ...prev, [cur]: isSortedDesc ? -1 : 1 }), {}))
      .skip((page - 1) * pageSize)
      .limit(pageSize);

    res.status(200).json({ users, count: total });
    return;
  } catch (error) {
    console.error("Error getting users:", error);
    next(error);
    return;
  }
};

export const getUser = async (
  req: AuthenticatedRequest<{ firebaseId: string }>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { firebaseId } = req.params;
    const user = await getUserFromMongoDB(firebaseId);

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    res.status(200).json(user);
    return;
  } catch (error) {
    console.error("Error getting user:", error);
    next(error);
    return;
  }
};

export const editPersonalInformation = async (
  req: AuthenticatedRequest<unknown, unknown, EditUserPersonalInformationRequestBody>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { firebaseUid } = req;
    const { newFirstName, newLastName, newEmail, newPhone } = req.body;

    const updatedUser = await UserModel.findOneAndUpdate(
      { firebaseId: firebaseUid },
      {
        "personal.firstName": newFirstName,
        "personal.lastName": newLastName,
        "personal.email": newEmail,
        "personal.phone": newPhone,
      },
      { new: true, runValidators: true },
    );

    if (!updatedUser) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    res
      .status(200)
      .json({ message: "Personal information updated", personal: updatedUser.personal });
    return;
  } catch (error) {
    console.error("Error updating personal information:", error);
    next(error);
    return;
  }
};

export const editProfessionalInformation = async (
  req: AuthenticatedRequest<unknown, unknown, EditUserProfessionalInformationRequestBody>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { firebaseUid } = req;
    const { newTitle, newPrefLanguage, newOtherPrefLanguage, newCountry } = req.body;

    const updatedUser = await UserModel.findOneAndUpdate(
      { firebaseId: firebaseUid },
      {
        "professional.title": newTitle,
        "professional.prefLanguage": newPrefLanguage,
        "professional.otherPrefLanguage": newOtherPrefLanguage,
        "professional.country": newCountry,
      },
      { new: true, runValidators: true },
    );

    if (!updatedUser) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    res.status(200).json({
      message: "Professional information updated",
      professional: updatedUser.professional,
    });
    return;
  } catch (error) {
    console.error("Error updating professional information:", error);
    next(error);
    return;
  }
};

export const editDirectoryPersonalInformation = async (
  req: AuthenticatedRequest<unknown, unknown, EditDirectoryPersonalInformationRequestBody>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { firebaseUid } = req;
    const {
      newDegree,
      newEducationInstitution,
      newClinicName,
      newClinicWebsiteUrl,
      newClinicAddress,
      newClinicCountry,
      newClinicApartmentSuite,
      newClinicCity,
      newClinicState,
      newClinicZipPostCode,
    } = req.body;

    const updatedUser = await UserModel.findOneAndUpdate(
      { firebaseId: firebaseUid },
      {
        "education.degree": newDegree,
        "education.institution": newEducationInstitution,
        "clinic.name": newClinicName,
        "clinic.url": newClinicWebsiteUrl,
        "clinic.location.address": newClinicAddress,
        "clinic.location.country": newClinicCountry,
        "clinic.location.suite": newClinicApartmentSuite,
        "clinic.location.city": newClinicCity,
        "clinic.location.state": newClinicState,
        "clinic.location.zipPostCode": newClinicZipPostCode,
      },
      { new: true, runValidators: true },
    );

    if (!updatedUser) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    res.status(200).json({
      message: "Directory personal information updated",
      directoryInfo: { ...updatedUser.education, ...updatedUser.clinic },
    });
    return;
  } catch (error) {
    console.error("Error updating directory personal information:", error);
    next(error);
    return;
  }
};

export const editDirectoryDisplayInfo = async (
  req: AuthenticatedRequest<unknown, unknown, EditDirectoryDisplayInformationRequestBody>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { firebaseUid } = req;
    const {
      newWorkEmail,
      newWorkPhone,
      newServices,
      newLanguages,
      newLicense,
      newRemoteOption,
      newRequestOption,
      newAuthorizedOption,
      newAppointmentsOption,
    } = req.body;

    const updatedUser = await UserModel.findOneAndUpdate(
      { firebaseId: firebaseUid },
      {
        "display.workEmail": newWorkEmail,
        "display.workPhone": newWorkPhone,
        "display.services": newServices,
        "display.languages": newLanguages,
        "display.license": newLicense,
        "display.options.remote": newRemoteOption,
        "display.options.openToRequests": newRequestOption,
        "display.options.authorizedCare": newAuthorizedOption,
        "display.options.openToAppointments": newAppointmentsOption,
      },
      { new: true, runValidators: true },
    );

    if (!updatedUser) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    res
      .status(200)
      .json({ message: "Directory display information updated", display: updatedUser.display });
    return;
  } catch (error) {
    console.error("Error updating directory display information:", error);
    next(error);
    return;
  }
};

export const editProfilePicture = async (
  req: AuthenticatedRequest<unknown, unknown, EditProfilePictureRequestBody>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { firebaseUid } = req;

    const updatedUser = await UserModel.findOneAndUpdate(
      { firebaseId: firebaseUid },
      {
        "account.profilePicture": req.body.profilePicture,
      },
      { new: true, runValidators: true },
    );

    if (!updatedUser) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    res.status(200).json({ message: "Profile picture updated", user: updatedUser });
  } catch (error) {
    next(error);
    return;
  }
};

export const editMembership = async (
  req: AuthenticatedRequest<unknown, unknown, { newMembership: string }>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { firebaseUid } = req;
    const { newMembership } = req.body;

    const user = await UserModel.findOne({ firebaseId: firebaseUid });

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    // If new membership is student or associate (not eligible for directory),
    // and user was in directory or pending, remove them from directory
    const isNewMembershipEligibleForDirectory =
      newMembership === "geneticCounselor" || newMembership === "healthcareProvider";
    const wasInDirectoryOrPending =
      user.account?.inDirectory === true || user.account?.inDirectory === "pending";

    const updateFields: Record<string, unknown> = {
      "account.membership": newMembership,
    };

    const shouldRemoveFromDirectory =
      !isNewMembershipEligibleForDirectory && wasInDirectoryOrPending;
    if (shouldRemoveFromDirectory) {
      updateFields["account.inDirectory"] = false;
    }

    const updatedUser = await UserModel.findOneAndUpdate(
      { firebaseId: firebaseUid },
      updateFields,
      { new: true, runValidators: true },
    );

    res.status(200).json({
      message: "Membership updated",
      user: updatedUser,
      removedFromDirectory: shouldRemoveFromDirectory,
    });
    return;
  } catch (error) {
    console.error("Error updating membership:", error);
    next(error);
    return;
  }
};

type UpdateStudentInfoRequestBody = {
  schoolCountry: string;
  schoolName: string;
  universityEmail: string;
  degree: string;
  programName: string;
  gradDate: string;
};

export const updateStudentInfo = async (
  req: AuthenticatedRequest<unknown, unknown, UpdateStudentInfoRequestBody>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { firebaseUid } = req;
    const { schoolCountry, schoolName, universityEmail, degree, programName, gradDate } = req.body;

    const user = await UserModel.findOne({ firebaseId: firebaseUid });

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    // Check if user has student membership
    if (user.account?.membership !== "student") {
      res.status(403).json({ error: "Only students can update student information" });
      return;
    }

    const updatedUser = await UserModel.findOneAndUpdate(
      { firebaseId: firebaseUid },
      {
        "education.schoolCountry": schoolCountry,
        "education.institution": schoolName,
        "education.email": universityEmail,
        "education.degree": degree.toLowerCase(),
        "education.program": programName,
        "education.gradDate": gradDate,
      },
      { new: true, runValidators: true },
    );

    res.status(200).json({ message: "Student information updated", user: updatedUser });
  } catch (error) {
    console.error("Error updating student information:", error);
    next(error);
  }
};

type UpdateAssociateInfoRequestBody = {
  jobTitle: string;
  specialization: string[];
  isOrganizationRepresentative: string;
  organizationName: string;
};

export const updateAssociateInfo = async (
  req: AuthenticatedRequest<unknown, unknown, UpdateAssociateInfoRequestBody>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { firebaseUid } = req;
    const { jobTitle, specialization, isOrganizationRepresentative, organizationName } = req.body;

    const user = await UserModel.findOne({ firebaseId: firebaseUid });

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    // Check if user has associate membership
    if (user.account?.membership !== "associate") {
      res.status(403).json({ error: "Only associates can update associate information" });
      return;
    }

    // Normalize specializations to lowercase for database enum matching
    const normalizedSpecializations = specialization?.map((s) => s.toLowerCase());

    const updatedUser = await UserModel.findOneAndUpdate(
      { firebaseId: firebaseUid },
      {
        "associate.title": jobTitle,
        "associate.specialization": normalizedSpecializations,
        "associate.organization": isOrganizationRepresentative === "yes" ? organizationName : "",
      },
      { new: true, runValidators: true },
    );

    res.status(200).json({ message: "Associate information updated", user: updatedUser });
  } catch (error) {
    console.error("Error updating associate information:", error);
    next(error);
  }
};

export const exportUsers = async (
  req: AuthenticatedRequest<unknown, unknown, ExportUsersRequestBody>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const {
      userIds,
      search,
      isAdmin,
      inDirectory,
      title,
      membership,
      education,
      services,
      country,
    } = req.body;

    let users;

    if (userIds && userIds.length > 0) {
      // Export specific users by their IDs
      users = await UserModel.find({ _id: { $in: userIds } });
    } else {
      // Export users matching the filters
      const query = buildUserQuery({
        search,
        isAdmin,
        inDirectory,
        title,
        membership,
        education,
        services,
        country,
      });
      users = await UserModel.find(query);
    }

    // Helper functions for formatting
    const formatRole = (role: string): string => {
      return role.charAt(0).toUpperCase() + role.slice(1);
    };

    const formatBoolean = (value: boolean | undefined): string => {
      return value ? "Yes" : "No";
    };

    const formatDirectoryStatus = (status: boolean | string | undefined): string => {
      if (status === true) return "Yes";
      if (status === false) return "No";
      if (status === "pending") return "Pending";
      return "";
    };

    const formatAuthorizedCare = (value: boolean | string | undefined): string => {
      if (value === true) return "Yes";
      if (value === false) return "No";
      if (value === "unsure") return "Unsure";
      return "";
    };

    const membershipDisplayMap: Record<string, string> = {
      student: "Student",
      geneticCounselor: "Genetic Counselor",
      healthcareProvider: "Healthcare Provider",
      associate: "Associate",
    };

    const professionalTitleMap: Record<string, string> = {
      medical_geneticist: "Medical Geneticist",
      genetic_counselor: "Genetic Counselor",
      student: "Student",
      other: "Other",
    };

    const languageMap: Record<string, string> = {
      english: "English",
      spanish: "Spanish",
      portuguese: "Portuguese",
      other: "Other",
    };

    const degreeMap: Record<string, string> = {
      masters: "Masters",
      diploma: "Diploma",
      fellowship: "Fellowship",
      md: "MD",
      phd: "PhD",
      other: "Other",
    };

    const specializationMap: Record<string, string> = {
      "rare disease advocacy": "Rare Disease Advocacy",
      research: "Research",
      "public health": "Public Health",
      bioethics: "Bioethics",
      law: "Law",
      biology: "Biology",
      "medical writer": "Medical Writer",
      "medical science liason": "Medical Science Liaison",
      "laboratory scientist": "Laboratory Scientist",
      professor: "Professor",
      bioinformatics: "Bioinformatics",
      "biotech sales and marketing": "Biotech Sales and Marketing",
    };

    const serviceMap: Record<string, string> = {
      pediatrics: "Pediatrics",
      cardiovascular: "Cardiovascular",
      neurogenetics: "Neurogenetics",
      rareDiseases: "Rare Diseases",
      cancer: "Cancer",
      biochemical: "Biochemical",
      prenatal: "Prenatal",
      adult: "Adult",
      psychiatric: "Psychiatric",
      reproductive: "Reproductive",
      ophthalmic: "Ophthalmic",
      research: "Research",
      pharmacogenomics: "Pharmacogenomics",
      metabolic: "Metabolic",
      other: "Other",
    };

    // Transform users to CSV rows
    const csvData = users.map((user) => ({
      // Name (combined first/last)
      Name: `${user.personal?.firstName ?? ""} ${user.personal?.lastName ?? ""}`.trim(),
      // Email
      Email: user.personal?.email ?? "",
      // Phone
      Phone: user.personal?.phone ?? "",
      // Role (title cased)
      Role: user.role ? formatRole(user.role) : "",
      // Date Joined
      "Date Joined": user.createdAt ? new Date(user.createdAt).toISOString().split("T")[0] : "",
      // User ID
      "User ID": user._id?.toString() ?? "",
      // Directory Status (formatted as Yes/No/Pending)
      "Directory Status": formatDirectoryStatus(
        user.account?.inDirectory as string | boolean | undefined,
      ),
      // Membership Type (using display map)
      "Membership Type": user.account?.membership
        ? membershipDisplayMap[user.account.membership] || user.account.membership
        : "",
      // Professional Title (using display map)
      "Professional Title": user.professional?.title
        ? professionalTitleMap[user.professional.title] || user.professional.title
        : "",
      // Preferred Language (coalesced with other, using display map)
      "Preferred Language":
        user.professional?.prefLanguage === "other"
          ? (user.professional?.otherPrefLanguage ?? "Other")
          : user.professional?.prefLanguage
            ? languageMap[user.professional.prefLanguage] || user.professional.prefLanguage
            : "",
      // Country
      Country: user.professional?.country ?? "",
      // Degree (coalesced with other, using display map)
      Degree:
        user.education?.degree === "other"
          ? user.education?.otherDegree || "Other"
          : user.education?.degree
            ? degreeMap[user.education.degree] || user.education.degree
            : "",
      // Program
      Program: user.education?.program ?? "",
      // Institution
      Institution: user.education?.institution ?? "",
      // School Email
      "School Email": user.education?.email ?? "",
      // Graduation Date
      "Graduation Date": user.education?.gradDate ?? "",
      // School Country
      "School Country": user.education?.schoolCountry ?? "",
      // Associate Title
      "Associate Title": user.associate?.title ?? "",
      // Specializations (comma-separated, using display map)
      Specializations: user.associate?.specialization
        ? user.associate.specialization.map((spec) => specializationMap[spec] || spec).join(", ")
        : "",
      // Organization
      Organization: user.associate?.organization ?? "",
      // Clinic Name
      "Clinic Name": user.clinic?.name ?? "",
      // Clinic URL
      "Clinic URL": user.clinic?.url ?? "",
      // Clinic Country
      "Clinic Country": user.clinic?.location?.country ?? "",
      // Clinic Address
      "Clinic Address": user.clinic?.location?.address ?? "",
      // Clinic Suite
      "Clinic Suite": user.clinic?.location?.suite ?? "",
      // Clinic City
      "Clinic City": user.clinic?.location?.city ?? "",
      // Clinic State
      "Clinic State": user.clinic?.location?.state ?? "",
      // Clinic Zip/Post Code
      "Clinic Zip/Post Code": user.clinic?.location?.zipPostCode ?? "",
      // Work Email
      "Work Email": user.display?.workEmail ?? "",
      // Work Phone
      "Work Phone": user.display?.workPhone ?? "",
      // Services (comma-separated, using display map)
      Services: user.display?.services
        ? user.display.services.map((service) => serviceMap[service] || service).join(", ")
        : "",
      // Care Languages (comma-separated, using display map)
      "Care Languages": user.display?.languages
        ? user.display.languages.map((lang) => languageMap[lang] || lang).join(", ")
        : "",
      // License Number (single - first one if array)
      "License Number": Array.isArray(user.display?.license)
        ? (user.display?.license[0] ?? "")
        : (user.display?.license ?? ""),
      // No License Reason
      "No License Reason": user.display?.comments?.noLicense ?? "",
      // Additional Comments
      "Additional Comments": user.display?.comments?.additional ?? "",
      // Open to Appointments (formatted as Yes/No)
      "Open to Appointments": formatBoolean(user.display?.options?.openToAppointments),
      // Open to Requests (formatted as Yes/No)
      "Open to Requests": formatBoolean(user.display?.options?.openToRequests),
      // Remote (formatted as Yes/No)
      Remote: formatBoolean(user.display?.options?.remote),
      // Authorized Care (formatted as Yes/No/Unsure)
      "Authorized Care": formatAuthorizedCare(
        user.display?.options?.authorizedCare as string | boolean | undefined,
      ),
    }));

    // Generate CSV using csv-stringify
    const csv = stringify(csvData, {
      header: true,
      columns: [
        "Name",
        "Email",
        "Phone",
        "Role",
        "Date Joined",
        "User ID",
        "Directory Status",
        "Membership Type",
        "Professional Title",
        "Preferred Language",
        "Country",
        "Degree",
        "Program",
        "Institution",
        "School Email",
        "Graduation Date",
        "School Country",
        "Associate Title",
        "Specializations",
        "Organization",
        "Clinic Name",
        "Clinic URL",
        "Clinic Country",
        "Clinic Address",
        "Clinic Suite",
        "Clinic City",
        "Clinic State",
        "Clinic Zip/Post Code",
        "Work Email",
        "Work Phone",
        "Services",
        "Care Languages",
        "License Number",
        "No License Reason",
        "Additional Comments",
        "Open to Appointments",
        "Open to Requests",
        "Remote",
        "Authorized Care",
      ],
    });

    // Set headers for file download
    res.setHeader("Content-Type", "text/csv");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="splagen_members_export_${String(Date.now())}.csv"`,
    );

    res.status(200).send(csv);
    return;
  } catch (error) {
    console.error("Error exporting users:", error);
    next(error);
    return;
  }
};
