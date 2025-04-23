import { NextFunction, Request, Response } from "express";

import { AuthenticatedRequest } from "../middleware/auth";
import UserModel, { UserMembership } from "../models/user";
import { sendDirectoryApprovalEmail, sendDirectoryDenialEmail } from "../services/emailService";

type ApproveDirectoryRequestBody = {
  //TODO: maybe MongoID of user to be approved denied depending on the frontend"
  firebaseId: string;
};

type DenyDirectoryRequestBody = {
  firebaseId: string;
  reason: string;
};

export const approveDirectoryEntry = async (
  req: AuthenticatedRequest<unknown, unknown, ApproveDirectoryRequestBody>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const pendingUserUid = req.body.firebaseId;

    const user = await UserModel.findOne({ firebaseId: pendingUserUid });

    if (!user || !user.personal || !user.account) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    if (user.account.inDirectory !== "pending") {
      res.status(400).json({ error: "User has not requested to be in the directory" });
      return;
    }

    if (
      ![UserMembership.GENETIC_COUNSELOR, UserMembership.HEALTHCARE_PROVIDER].includes(
        user.account.membership as UserMembership,
      )
    ) {
      res.status(400).json({ error: "User is not a genetic counselor or healthcare provider" });
      return;
    }

    user.account.inDirectory = true;
    await user.save();

    const { firstName, email } = user.personal;

    await sendDirectoryApprovalEmail(email, firstName);

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
    // firebaseID for the the user to be denied
    const { firebaseId, reason } = req.body;

    const user = await UserModel.findOne({ firebaseId });

    if (!user || !user.personal || !user.account) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    if (user.account.inDirectory !== "pending") {
      res.status(400).json({ error: "User has not requested to be in the directory" });
      return;
    }

    user.account.inDirectory = false;

    await user.save();

    const { firstName, email } = user.personal;

    await sendDirectoryDenialEmail(email, firstName, reason);

    res.status(200).json({ message: "Directory entry denied and email sent" });
  } catch (error) {
    next(error);
  }
};

export const getPublicDirectory = async (_req: Request, res: Response) => {
  try {
    const users = await UserModel.find({
      "account.inDirectory": true,
      "account.membership": { $in: ["geneticCounselor", "healthcareProvider"] },
    });

    const directory = users.map((user) => ({
      name: `${user.personal?.firstName ?? ""} ${user.personal?.lastName ?? ""}`,
      title: user.professional?.title ?? "Genetic Counselor",
      address:
        `${user.clinic?.location?.address ?? ""} ${user.clinic?.location?.suite ?? ""}`.trim(),
      organization: user.clinic?.name ?? "",
      email: user.display?.workEmail ?? user.personal?.email ?? "",
      phone: user.display?.workPhone ?? user.personal?.phone ?? "",
      specialties: user.display?.services ?? [],
      languages: [
        ...(user.display?.languages ?? []),
        ...(user.professional?.prefLanguages?.includes("other") &&
        user.professional.otherPrefLanguages
          ? [user.professional.otherPrefLanguages]
          : []),
      ],
      profileUrl: user.clinic?.url ?? "",
    }));

    res.status(200).json(directory);
  } catch (err) {
    console.error("Error fetching directory:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};
