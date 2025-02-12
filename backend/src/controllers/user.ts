import { NextFunction, Request, Response } from "express";
import User from "../models/user";
import {AuthenticatedRequest} from "../types/AuthenticatedRequest";

// RequestHandler is a codebreaking change and is removed
// NextFunction is also removed for more standard and precise error handling

// Temporary storage until database is set up
// type User = {
//   id: number;
//   name: string;
//   email: string;
// };
// Define a custom request type that includes the 'user' property
//const users: typeof User[] = [];

export const createUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // const { name, email } = req.body as { name: string; email: string };
    // if (!name || !email) {
    //   res.status(400).json({ error: "Name and email are required" });
    //   return;
    // }
    // const newUser: typeof User = {
    //   id: users.length + 1,
    //   name,
    //   email,
    // };
    //users.push(newUser);
    const {
      firebaseId,
      account,
      personal,
      professional,
      education,
      clinic,
      display,
    } = req.body;

    // Validate required fields
    if (!firebaseId || !account || !personal || !personal.firstName || !personal.lastName || !personal.email) {
      res.status(400).json({ error: "Missing required fields" });
      return;
    }


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
    //Either handle directly or next(error)
    res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // const id = parseInt(req.params.id, 10);
    // if (isNaN(id)) {
    //   res.status(400).json({ error: "Valid user ID is required" });
    //   return;
    // }
    // const index = users.findIndex((user) => user.id === id);
    // if (index === -1) {
    //   res.status(404).json({ error: "User not found" });
    //   return;
    // }
    // users.splice(index, 1);

    const { firebaseId } = req.params;
    const deletedUser = await User.findOneAndDelete({ firebaseId });

    if (!deletedUser) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    //Either handle directly or next(error)
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getAllUsers = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await User.find({});
    res.status(200).json({ users });
  } catch (error) {
    console.error("Error getting users:", error);
    //Either handle directly or next(error)
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // const id = parseInt(req.params.id, 10);
    // if (isNaN(id)) {
    //   res.status(400).json({ error: "Valid user ID is required" });
    //   return;
    // }
    // const user = users.find((u) => u.id === id);
    const { firebaseId } = req.params;
    const user = await User.findOne({ firebaseId });

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    res.status(200).json({ user });
  } catch (error) {
    console.error("Error getting user:", error);
    //Either handle directly or next(error)
    res.status(500).json({ error: "Internal server error" });
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
    //Either handle directly or next(error)
    res.status(500).json({ error: "Internal server error" });
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
    //Either handle directly or next(error)
    res.status(500).json({ error: "Internal server error" });
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
    //Either handle directly or next(error)
    res.status(500).json({ error: "Internal server error" });
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
    //Either handle directly or next(error)
    res.status(500).json({ error: "Internal server error" });
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
    //Either handle directly or next(error)
    res.status(500).json({ error: "Internal server error" });
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
    //Either handle directly or next(error)
    res.status(500).json({ error: "Internal server error" });
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
    //Either handle directly or next(error)
    res.status(500).json({ error: "Internal server error" });
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
    //Either handle directly or next(error)
    res.status(500).json({ error: "Internal server error" });
  }
};
