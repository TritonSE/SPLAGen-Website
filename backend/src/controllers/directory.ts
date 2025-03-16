import { Request, Response } from "express";

import UserModel from "../models/user";
import { sendApprovalEmail, sendDenialEmail } from "../services/emailService";

type ApproveDirectoryRequestBody = {
  firebaseId: string;
};

type DenyDirectoryRequestBody = {
  firebaseId: string;
  reason: string;
};

export const approveDirectoryEntry = async (
  req: Request<unknown, unknown, ApproveDirectoryRequestBody>,
  res: Response,
) => {
  try {
    const { firebaseId } = req.body;

    if (!firebaseId) {
      res.status(400).json({ error: "ID is required" });
      return;
    }

    // Send the approval email

    const user = await UserModel.findOne({ firebaseId });

    if (!user || !user.personal) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    await user.save();

    const { firstName, email } = user.personal;

    await sendApprovalEmail(email, firstName);

    res.status(200).json({ message: "Directory entry approved and email sent" });
  } catch (error) {
    console.error("Error approving directory entry:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const denyDirectoryEntry = async (
  req: Request<unknown, unknown, DenyDirectoryRequestBody>,
  res: Response,
) => {
  try {
    const { firebaseId, reason } = req.body;

    if (!firebaseId || !reason) {
      res.status(400).json({ error: "Email, name, and reason are required" });
      return;
    }

    // Send the denial email

    const user = await UserModel.findOne({ firebaseId });

    if (!user || !user.personal) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    await user.save();

    const { firstName, email } = user.personal;

    await sendDenialEmail(email, firstName, reason);

    res.status(200).json({ message: "Directory entry denied and email sent" });
  } catch (error) {
    console.error("Error denying directory entry:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
