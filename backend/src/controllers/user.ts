import { NextFunction, Request, Response } from "express";

import { AuthenticatedRequest } from "../middleware/auth";
import UserModel, { UserRole } from "../models/user";
import { firebaseAdminAuth } from "../util/firebase";
import { deleteUserFromFirebase, deleteUserFromMongoDB, getUserFromMongoDB } from "../util/user";

import {
  CreateUserRequestBody,
  EditDirectoryDisplayInformationRequestBody,
  EditDirectoryPersonalInformationRequestBody,
  EditProfilePictureRequestBody,
  EditUserPersonalInformationRequestBody,
  EditUserProfessionalInformationRequestBody,
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

export const getUsers = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    // Search
    const searchTerm = req.query.search;

    // Pagination
    const page = parseInt(req.query.page as string);
    const pageSize = parseInt(req.query.pageSize as string);

    // Filters - TODO implement these
    const isAdminFilter = req.query.isAdmin;
    const inDirectoryFilter = req.query.inDirectory;
    const titleFilter = req.query.title;
    const membershipFilter = req.query.membership;
    const educationFilter = req.query.education;
    const servicesFilter = req.query.services;

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

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const filters: any[] = [];

    // Text search
    if (searchTerm) {
      filters.push({
        $or: [
          { "personal.firstName": { $regex: searchTerm, $options: "i" } },
          { "personal.lastName": { $regex: searchTerm, $options: "i" } },
        ],
      });
    }

    if (isAdminFilter === "true") {
      filters.push({
        $or: [
          { role: UserRole.SUPERADMIN },
          {
            role: UserRole.ADMIN,
          },
        ],
      });
    } else if (isAdminFilter === "false") {
      filters.push({
        role: UserRole.MEMBER,
      });
    }

    if (inDirectoryFilter !== undefined && inDirectoryFilter !== "") {
      filters.push({
        "account.inDirectory":
          inDirectoryFilter === "true"
            ? true
            : inDirectoryFilter === "false"
              ? false
              : inDirectoryFilter,
      });
    }

    if (titleFilter) {
      filters.push({
        "professional.title": titleFilter,
      });
    }

    if (membershipFilter) {
      filters.push({
        "account.membership": membershipFilter,
      });
    }

    if (educationFilter) {
      filters.push({
        "education.degree": educationFilter,
      });
    }

    if (servicesFilter) {
      filters.push({
        "display.services": servicesFilter,
      });
    }

    const query = filters.length > 0 ? { $and: filters } : {};

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
    const { newTitle, newPrefLanguages, newOtherPrefLanguages, newCountry } = req.body;

    const updatedUser = await UserModel.findOneAndUpdate(
      { firebaseId: firebaseUid },
      {
        "professional.title": newTitle,
        "professional.prefLanguages": newPrefLanguages,
        "professional.otherPrefLanguages": newOtherPrefLanguages,
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
