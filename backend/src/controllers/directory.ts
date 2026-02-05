import { NextFunction, Request, Response } from "express";

import { AuthenticatedRequest } from "../middleware/auth";
import UserModel, { User, UserMembership } from "../models/user";
import { sendDirectoryApprovalEmail, sendDirectoryDenialEmail } from "../services/emailService";

type JoinDirectoryRequestBody = {
  education: {
    degree: string;
    otherDegree?: string;
    institution: string;
  };
  clinic: {
    name: string;
    url: string;
    location: {
      country: string;
      address: string;
      suite?: string;
      city: string;
      state: string;
      zipPostCode: string;
    };
  };
  display: {
    workEmail: string;
    workPhone: string;
    services: string[];
    languages: string[];
    license: string[];
    options: {
      openToAppointments: boolean;
      openToRequests: boolean;
      remote: boolean;
      authorizedCare: string | boolean;
    };
    comments: {
      noLicense?: string;
      additional?: string;
    };
  };
};

type ApproveDirectoryRequestBody = {
  userIds: string[];
};

type DenyDirectoryRequestBody = {
  userIds: string[];
  reason: string;
};

export const joinDirectory = async (
  req: AuthenticatedRequest<unknown, unknown, JoinDirectoryRequestBody>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { firebaseUid } = req;

    const { education, clinic, display } = req.body;

    const updatedUser = await UserModel.findOneAndUpdate(
      { firebaseId: firebaseUid },
      {
        // Update user's directory status to pending (now we need to wait for admin approval to join)
        "account.inDirectory": "pending",

        // Update user with directory information
        "education.degree": education.degree,
        "education.otherDegree": education.otherDegree,
        "education.institution": education.institution,

        "clinic.name": clinic.name,
        "clinic.url": clinic.url,
        "clinic.location.address": clinic.location.address,
        "clinic.location.country": clinic.location.country,
        "clinic.location.suite": clinic.location.suite,
        "clinic.location.city": clinic.location.city,
        "clinic.location.state": clinic.location.state,
        "clinic.location.zipPostCode": clinic.location.zipPostCode,

        "display.workEmail": display.workEmail,
        "display.workPhone": display.workPhone,
        "display.services": display.services,
        "display.languages": display.languages,
        "display.license": display.license,
        "display.options": display.options,
        "display.comments": display.comments,
      },
      { new: true, runValidators: true },
    );

    if (!updatedUser) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    res.status(200).json({ message: "Request received", user: updatedUser });
  } catch (error) {
    next(error);
  }
};

export const leaveDirectory = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { firebaseUid } = req;

    const updatedUser = await UserModel.findOneAndUpdate(
      { firebaseId: firebaseUid },
      {
        "account.inDirectory": false,
      },
      { new: true, runValidators: true },
    );

    if (!updatedUser) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    res.status(200).json({ message: "Successfully removed from directory", user: updatedUser });
  } catch (error) {
    next(error);
  }
};

export const approveDirectoryEntry = async (
  req: AuthenticatedRequest<unknown, unknown, ApproveDirectoryRequestBody>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const errorMap: Record<string, string> = {};
    await Promise.all(
      req.body.userIds.map(async (userId) => {
        const user = await UserModel.findById(userId);

        if (!user || !user.personal || !user.account) {
          errorMap[userId] = "User not found";
          return;
        }

        if (user.account.inDirectory !== "pending") {
          errorMap[userId] = "User has not requested to be in the directory";
          return;
        }

        if (
          ![UserMembership.GENETIC_COUNSELOR, UserMembership.HEALTHCARE_PROVIDER].includes(
            user.account.membership as UserMembership,
          )
        ) {
          errorMap[userId] = "User is not a genetic counselor or healthcare provider";
          return;
        }

        user.account.inDirectory = true;
        await user.save();

        const { firstName, email } = user.personal;

        await sendDirectoryApprovalEmail(email, firstName);
      }),
    );

    if (Object.keys(errorMap).length > 0) {
      res.status(400).json(errorMap);
      return;
    }

    res.status(200).json({ message: "Directory entry approved and email sent" });
  } catch (error) {
    next(error);
  }
};

export const denyDirectoryEntry = async (
  req: AuthenticatedRequest<unknown, unknown, DenyDirectoryRequestBody>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { userIds, reason } = req.body;
    const errorMap: Record<string, string> = {};
    await Promise.all(
      userIds.map(async (userId) => {
        const user = await UserModel.findById(userId);

        if (!user || !user.personal || !user.account) {
          errorMap[userId] = "User not found";
          return;
        }

        if (user.account.inDirectory !== "pending") {
          errorMap[userId] = "User has not requested to be in the directory";
          return;
        }

        user.account.inDirectory = false;
        await user.save();

        const { firstName, email } = user.personal;

        await sendDirectoryDenialEmail(email, firstName, reason);
      }),
    );

    if (Object.keys(errorMap).length > 0) {
      res.status(400).json(errorMap);
    }

    res.status(200).json({ message: "Directory entry denied and email sent" });
  } catch (error) {
    next(error);
  }
};

const formatUserForDirectory = (user: User) => ({
  name: `${user.personal?.firstName ?? ""} ${user.personal?.lastName ?? ""}`,
  title: user.professional?.title ?? "Genetic Counselor",
  address: `${user.clinic?.location?.address ?? ""} ${user.clinic?.location?.suite ?? ""}`.trim(),
  organization: user.clinic?.name ?? "",
  email: user.display?.workEmail ?? user.personal?.email ?? "",
  phone: user.display?.workPhone ?? user.personal?.phone ?? "",
  specialties: user.display?.services ?? [],
  languages: user.display?.languages,
  profileUrl: user.clinic?.url ?? "",
});

export const getPublicDirectory = async (req: Request, res: Response) => {
  try {
    const search = req.query.search as string | undefined;
    const languages = req.query.languages as string | undefined;
    const specializations = req.query.specializations as string | undefined;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const filters: any[] = [
      { "account.inDirectory": true },
      { "account.membership": { $in: ["geneticCounselor", "healthcareProvider"] } },
    ];

    // Search by name
    if (search) {
      filters.push({
        $or: [
          { "personal.firstName": { $regex: search, $options: "i" } },
          { "personal.lastName": { $regex: search, $options: "i" } },
        ],
      });
    }

    // Filter by languages
    if (languages) {
      const languageArray = languages.split(",");
      filters.push({
        "display.languages": { $in: languageArray },
      });
    }

    // Filter by specializations (services)
    if (specializations) {
      const specializationArray = specializations.split(",");
      filters.push({
        "display.services": { $in: specializationArray },
      });
    }

    const query = { $and: filters };

    const users = await UserModel.find(query);

    const directory = users.map(formatUserForDirectory);

    res.status(200).json(directory);
  } catch (err) {
    console.error("Error fetching directory:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};
