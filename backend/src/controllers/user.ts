import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import admin from "firebase-admin";
import UserModel from "../models/user";
import DirectoryModel from "../models/directory";
import { firebaseAdminAuth } from "../util/firebase";
import { CreateUserRequestBody,
  EditUserPersonalInformationRequestBody,
  EditUserProfessionalInformationRequestBody,
  EditDirectoryPersonalInformationRequestBody,
  EditDirectoryDisplayInformationRequestBody
} from "./types/userTypes";
import { deleteUserFromFirebase, deleteUserFromMongoDB } from "../util/user";


export const createUser = async (
  req: Request<Record<string, never>, Record<string, never>, CreateUserRequestBody>,
  res: Response,
  next: NextFunction
) => {
  try {

    const {
      account,
      personal,
      professional,
      education,
      clinic,
      display,
      password
    } = req.body;

    //Create user in firestore
    const userRecord = await firebaseAdminAuth.createUser({
      email: personal.email,
      password: password,
    } as admin.auth.CreateRequest);

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

  return;
};

export const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
  try {

    const { firebaseId } = req.params;

    // delete user from Firebase and MongoDB
    await deleteUserFromFirebase(firebaseId);
    await deleteUserFromMongoDB(firebaseId);

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    next(error);
  }
};

export const getAllUsers = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await UserModel.find({}).exec();
    res.status(200).json({ users });
  } catch (error) {
    console.error("Error getting users:", error);
    next(error);
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

    res.status(200).json({ user });
  } catch (error) {
    console.error("Error getting user:", error);
    next(error);
  }
};


export const getPersonalInformation = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { firebaseId } = req.params;
    const user = await UserModel.findOne({ firebaseId });

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    res.status(200).json(user.personal);
  } catch (error) {
    console.error("Error fetching user personal information:", error);
    next(error);
  }
};

export const editPersonalInformation = async (
  req: Request<Record<string, never>, Record<string, never>, EditUserPersonalInformationRequestBody>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { uid, newFirstName, newLastName, newEmail, newPhone } = req.body;

    const user = await UserModel.findById(uid);
    
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }
    
    const updatedUser = await UserModel.findByIdAndUpdate(uid,
      {
        "personal.firstName": newFirstName,
        "personal.lastName": newLastName,
        "personal.email": newEmail,
        "personal.phone": newPhone,
      },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      res.status(404).json({ error: "Updated User not found" });
      return;
    }

    res.status(200).json({ message: "Personal information updated", personal: updatedUser.personal });
  } catch (error) {
    console.error("Error updating personal information:", error);
    next(error);
  }
};

export const getProfessionalInformation = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { firebaseId } = req.params;
    const user = await UserModel.findOne({ firebaseId });

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    res.status(200).json(user.professional);
  } catch (error) {
    console.error("Error fetching user professional information:", error);
    next(error);
  }
};

export const editProfessionalInformation = async (
  req:  Request<Record<string, never>, Record<string, never>, EditUserProfessionalInformationRequestBody>,
  res: Response,
  next: NextFunction) => {
    try {
      const { uid,
              newTitle,
              newPrefLanguages,
              newOtherPrefLanguages,
              newCountry } = req.body;

    const user = await UserModel.findById(uid);

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }
    
    const updatedUser = await UserModel.findByIdAndUpdate(uid,
      {
        "professional.title": newTitle,
        "professional.prefLanguages": newPrefLanguages,
        "professional.otherPrefLanguages": newOtherPrefLanguages,
        "professional.newCountry": newCountry,
      },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      res.status(404).json({ error: "Updated User not found" });
      return;
    }

    res.status(200).json({ message: "Professional information updated", professional: updatedUser.professional });
  } catch (error) {
    console.error("Error updating professional information:", error);
    next(error);
  }
};


export const getDirectoryPersonalInformation = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { firebaseId } = req.params;
    const user = await UserModel.findOne({ firebaseId });

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    //Directory Personal Information contained in (subset of) education + clinic
    res.status(200).json({...user.education, ...user.clinic});
  } catch (error) {
    console.error("Error fetching user professional information:", error);
    next(error);
  }
};

export const editDirectoryPersonalInformation = async (
  req: Request<Record<string, never>, Record<string, never>, EditDirectoryPersonalInformationRequestBody>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { uid,
            newDegree,
            newEducationInstitution,
            newClinicName,
            newClinicWebsiteUrl,
            newClinicAddress} = req.body;
    
    const user = await UserModel.findById(uid);

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }
    
    const updatedUser = await UserModel.findByIdAndUpdate(uid,
      {
        "education.degree": newDegree,
        "education.institution": newEducationInstitution,
        "clinic.name": newClinicName,
        "clinic.location.address": newClinicAddress,
        "clinic.url": newClinicWebsiteUrl
      },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      res.status(404).json({ error: "Updated User not found" });
      return;
    }

    res.status(200).json({ message: "Directory information updated", personal: {...user.education, ...user.clinic} });
  } catch (error) {
    console.error("Error updating directory personal information:", error);
    next(error);
  }
};

export const getDirectoryDisplayInfo = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { firebaseId } = req.params;
    const user = await UserModel.findOne({ firebaseId });

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    res.status(200).json(user.display);
  } catch (error) {
    console.error("Error fetching directory display information:", error);
    next(error);
  }
};

export const editDirectoryDisplayInfo = async (
  req: Request<Record<string, never>, Record<string, never>, EditDirectoryDisplayInformationRequestBody>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { uid,
            newWorkEmail,
            newWorkPhone,
            newServices,
            newLanguages,
            newLicense,
            newRemoteOption,
            newRequestOption} = req.body;
    
    const user = await UserModel.findById(uid);

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }
    
    const updatedUser = await UserModel.findByIdAndUpdate(uid,
      {
        "display.workEmail": newWorkEmail,
        "display.workPhone": newWorkPhone,
        "display.services": newServices,
        "display.languages": newLanguages,
        "display.license": newLicense,
        "display.options.remote": newRemoteOption,
        "display.options.openToRequests": newRequestOption
      },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      res.status(404).json({ error: "Updated User not found" });
      return;
    }

    res.status(200).json({ message: "Directory information updated", personal: {...user.education, ...user.clinic} });
  } catch (error) {
    console.error("Error updating directory personal information:", error);
    next(error);
  }
};
