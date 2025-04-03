import { NextFunction, Request, Response } from "express";
import admin from "firebase-admin";

import { AuthenticatedRequest } from "../middleware/auth";
import UserModel from "../models/user";
import { firebaseAdminAuth } from "../util/firebase";
import { deleteUserFromFirebase, deleteUserFromMongoDB } from "../util/user";

import { CreateUserRequestBody,
  EditDirectoryDisplayInformationRequestBody,
  EditDirectoryPersonalInformationRequestBody,
  EditUserPersonalInformationRequestBody,
  EditUserProfessionalInformationRequestBody
} from "./types/userTypes";

export const createUser = async (
  req: Request<Record<string, never>, Record<string, never>, CreateUserRequestBody>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { account, personal, professional, education, clinic, display, password } = req.body;

    // Create user in Firebase
    const userRecord = await firebaseAdminAuth.createUser({
      email: personal.email,
      password,
    } as admin.auth.CreateRequest);

    // Create new user in MongoDB
    const newUser = await UserModel.create({
      firebaseId: userRecord.uid,
      account,
      personal,
      professional,
      education,
      clinic,
      display,
    });

    res.status(201).json(newUser);
  } catch (error) {
    console.error("Error creating user:", error);
    next(error);
  }
};


export const authenticateUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { token } = req.body;
    const decodedToken = await firebaseAdminAuth.verifyIdToken(token);
    const user = await UserModel.findOne({ firebaseId: decodedToken.uid });

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    res.status(200).json({
      firebaseId: decodedToken.uid,
      role: user.role,
      personal: user.personal,
      email: user.personal?.email,
    });
  } catch (error) {
    console.error("Error during user authentication:", error);
    res.status(401).json({ error: "Authentication failed" });
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

    res.status(200).json({
      firebaseId: user.firebaseId,
      role: user.role,
      personal: user.personal,
      professional: user.professional,
    });
    return;
  } catch (error) {
    next(error);
    return;
  }
};

export const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
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

export const getAllUsers = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await UserModel.find({}).exec();
    res.status(200).json({ users });
    return;
  } catch (error) {
    console.error("Error getting users:", error);
    next(error);
    return
  }
};


export const getUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { firebaseId } = req.params;
    const user = await UserModel.findOne({ firebaseId });

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    res.status(200).json(user);
    return;
  } catch (error) {
    console.error("Error getting user:", error);
    res.status(500).json({ error: "Internal server error" });
    return;
  }
};

// Testing code for getPersonalInformation below:
// export const getPersonalInformation: RequestHandler = async (req, res, next) => {
//   try {
//     res.status(200).send("Get personal information route works!");
//   } catch (error) {
//     next(error);
//   }
// };


export const getPersonalInformation = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { firebaseUid } = req;
    const user = await UserModel.findOne({ firebaseId: firebaseUid });

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    res.status(200).json(user.personal);
    return;
  } catch (error) {
    console.error("Error fetching personal information:", error);
    next(error);
    return;
  }
};


export const editPersonalInformation = async (
  req: AuthenticatedRequest<{}, {}, EditUserPersonalInformationRequestBody>, 
  res: Response, 
  next: NextFunction
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
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    res.status(200).json({ message: "Personal information updated", personal: updatedUser.personal });
    return;
  } catch (error) {
    console.error("Error updating personal information:", error);
    next(error);
    return;
  }
};



export const getProfessionalInformation = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { firebaseUid } = req;
    const user = await UserModel.findOne({ firebaseId: firebaseUid });

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    res.status(200).json(user.professional);
    return;
  } catch (error) {
    console.error("Error fetching professional information:", error);
    next(error);
    return;
  }
};


export const editProfessionalInformation = async (
  req: AuthenticatedRequest<{}, {}, EditUserProfessionalInformationRequestBody>, 
  res: Response, 
  next: NextFunction
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
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    res.status(200).json({ message: "Professional information updated", professional: updatedUser.professional });
    return;
  } catch (error) {
    console.error("Error updating professional information:", error);
    next(error);
    return;
  }
};



export const getDirectoryPersonalInformation = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { firebaseUid } = req;
    const user = await UserModel.findOne({ firebaseId: firebaseUid });

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    // Combine education and clinic fields for directory information
    res.status(200).json({ ...user.education, ...user.clinic });
    return;
  } catch (error) {
    console.error("Error fetching directory personal information:", error);
    next(error);
    return;
  }
};


export const editDirectoryPersonalInformation = async (
  req: AuthenticatedRequest<{}, {}, EditDirectoryPersonalInformationRequestBody>, 
  res: Response, 
  next: NextFunction
) => {
  try {
    const { firebaseUid } = req;
    const { newDegree, newEducationInstitution, newClinicName, newClinicWebsiteUrl, newClinicAddress } = req.body;

    const updatedUser = await UserModel.findOneAndUpdate(
      { firebaseId: firebaseUid },
      {
        "education.degree": newDegree,
        "education.institution": newEducationInstitution,
        "clinic.name": newClinicName,
        "clinic.url": newClinicWebsiteUrl,
        "clinic.location.address": newClinicAddress,
      },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    res.status(200).json({ message: "Directory personal information updated", directoryInfo: { ...updatedUser.education, ...updatedUser.clinic } });
    return;
  } catch (error) {
    console.error("Error updating directory personal information:", error);
    next(error);
    return;
  }
};

export const getDirectoryDisplayInfo = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { firebaseUid } = req;
    const user = await UserModel.findOne({ firebaseId: firebaseUid });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(user.display);
  } catch (error) {
    console.error("Error fetching directory display information:", error);
    next(error);
  }
};


export const editDirectoryDisplayInfo = async (
  req: AuthenticatedRequest<{}, {}, EditDirectoryDisplayInformationRequestBody>, 
  res: Response, 
  next: NextFunction
) => {
  try {
    const { firebaseUid } = req;
    const { newWorkEmail, newWorkPhone, newServices, newLanguages, newLicense, newRemoteOption, newRequestOption } = req.body;

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
      },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    res.status(200).json({ message: "Directory display information updated", display: updatedUser.display });
    return;
  } catch (error) {
    console.error("Error updating directory display information:", error);
    next(error);
    return;
  }
};
