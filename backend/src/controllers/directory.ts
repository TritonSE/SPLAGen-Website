// src/controllers/directoryController.ts
import { Request, Response } from "express";

import { sendApprovalEmail, sendDenialEmail } from "../services/emailService";

type ApproveDirectoryRequestBody = {
  email: string;
  name: string;
};

type DenyDirectoryRequestBody = {
  email: string;
  name: string;
  reason: string;
};

export const approveDirectoryEntry = async (
  req: Request<unknown, unknown, ApproveDirectoryRequestBody>,
  res: Response,
) => {
  try {
    const { email, name } = req.body;

    if (!email || !name) {
      res.status(400).json({ error: "Email and name are required" });
      return;
    }

    // Send the approval email
    await sendApprovalEmail(email, name);

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
    const { email, name, reason } = req.body;

    if (!email || !name || !reason) {
      res.status(400).json({ error: "Email, name, and reason are required" });
      return;
    }

    // Send the denial email
    await sendDenialEmail(email, name, reason);

    res.status(200).json({ message: "Directory entry denied and email sent" });
  } catch (error) {
    console.error("Error denying directory entry:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
