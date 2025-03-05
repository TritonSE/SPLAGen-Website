import { NextFunction, Request, Response } from "express";

import User from "../models/user";
import {AuthenticatedRequest} from "../types/AuthenticatedRequest";

// RequestHandler is a codebreaking change and is removed

export const createUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      firebaseId,
      account,
      personal,
      professional,
      education,
      clinic,
      display,
    } = req.body;


    const newUser = new User({
      firebaseId,
      account,
      personal,
      professional,
      education,
      clinic,
      display,
    });
    await newUser.save();

    res.status(201).json({ message: "User created successfully", user: newUser });
  } catch (error) {
    console.error("Error creating user:", error);
    next(error);
  }
};

export const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
  try {

    const { firebaseId } = req.params;
    const deletedUser = await User.findOneAndDelete({ firebaseId });

    if (!deletedUser) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    next(error);
  }
};

export const getAllUsers = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await User.find({});
    res.status(200).json({ users });
  } catch (error) {
    console.error("Error getting users:", error);
    next(error);
  }
};

export const getUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { firebaseId } = req.params;
    const user = await User.findOne({ firebaseId });

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


export const getPersonalInformation = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const user = await User.findOne({ firebaseId: req.user?.firebaseId }).select("personal");
    
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    res.status(200).json(user.personal);
  } catch (error) {
    console.error("Error fetching personal information:", error);
    next(error);
  }
};

export const editPersonalInformation = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { firstName, lastName, email, phone } = req.body;

    const updatedUser = await User.findOneAndUpdate(
      { firebaseId: req.user?.firebaseId },
      {
        "personal.firstName": firstName,
        "personal.lastName": lastName,
        "personal.email": email,
        "personal.phone": phone,
      },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    res.status(200).json({ message: "Personal information updated", personal: updatedUser.personal });
  } catch (error) {
    console.error("Error updating personal information:", error);
    next(error);
  }
};

export const getProfessionalInformation = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const user = await User.findOne({ firebaseId: req.user?.firebaseId }).select("professional");
    
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    res.status(200).json(user.professional);
  } catch (error) {
    console.error("Error fetching professional information:", error);
    next(error);
  }
};

export const editProfessionalInformation = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { title, prefLanguages, otherPrefLanguages, country } = req.body;

    const updatedUser = await User.findOneAndUpdate(
      { firebaseId: req.user?.firebaseId },
      {
        "professional.title": title,
        "professional.prefLanguages": prefLanguages,
        "professional.otherPrefLanguages": otherPrefLanguages,
        "professional.country": country,
      },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    res.status(200).json({ message: "Professional information updated", professional: updatedUser.professional });
  } catch (error) {
    console.error("Error updating professional information:", error);
    next(error);
  }
};

export const getDirectoryPersonalInformation = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const user = await User.findOne({ firebaseId: req.user?.firebaseId }).select("personal");
    
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    res.status(200).json(user.personal);
  } catch (error) {
    console.error("Error fetching directory personal information:", error);
    next(error);
  }
};

export const editDirectoryPersonalInformation = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { firstName, lastName, email, phone } = req.body;

    const updatedUser = await User.findOneAndUpdate(
      { firebaseId: req.user?.firebaseId },
      { "personal.firstName": firstName, "personal.lastName": lastName, "personal.email": email, "personal.phone": phone },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    res.status(200).json({ message: "Directory personal information updated", personal: updatedUser.personal });
  } catch (error) {
    console.error("Error updating directory personal information:", error);
    next(error);
  }
};

export const getDirectoryDisplayInfo = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const user = await User.findOne({ firebaseId: req.user?.firebaseId }).select("display");
    
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

export const editDirectoryDisplayInfo = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { workEmail, workPhone, services, languages, license, options, comments } = req.body;

    const updatedUser = await User.findOneAndUpdate(
      { firebaseId: req.user?.firebaseId },
      {
        "display.workEmail": workEmail,
        "display.workPhone": workPhone,
        "display.services": services,
        "display.languages": languages,
        "display.license": license,
        "display.options": options,
        "display.comments": comments,
      },
      { new: true, runValidators: true }
    );
    
    if (!updatedUser) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    res.status(200).json({ message: "Directory display information updated", display: updatedUser.display });
  } catch (error) {
    console.error("Error updating directory display information:", error);
    next(error);
  }
};
