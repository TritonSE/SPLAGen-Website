import { NextFunction, RequestHandler, Response } from "express";

import { AuthenticatedRequest } from "../middleware/auth";
import Announcement from "../models/announcement";
import { UserRole } from "../models/user";

type createAnnouncementRequestBody = {
  title: string;
  message: string;
  recipients: "everyone" | string[];
};

export const createAnnouncement = async (
  req: AuthenticatedRequest<unknown, unknown, createAnnouncementRequestBody>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { title, message, recipients } = req.body;
    const userId = req.mongoID;

    const newAnnouncement = new Announcement({ userId, title, message, recipients });

    await newAnnouncement.save();
    res
      .status(201)
      .json({ message: "Announcement created successfully", announcement: newAnnouncement });
  } catch (error) {
    next(error);
  }
};

export const editAnnouncement: RequestHandler = async (req, res, next) => {
  try {
    res.status(200).send("Edit announcement route works!");
  } catch (error) {
    next(error);
  }
};

export const deleteAnnouncement: RequestHandler = async (req, res, next) => {
  try {
    res.status(200).send("Delete announcement route works!");
  } catch (error) {
    next(error);
  }
};

export const getMultipleAnnouncements = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userRole = req.role;
    const userEmail = req.userEmail;

    let query = {};
    if (![UserRole.ADMIN, UserRole.SUPERADMIN].includes(userRole as UserRole)) {
      // If the user is not an admin or super admin, filter announcements by their email
      query = { recipients: { $in: [userEmail, "everyone"] } };
    }

    const announcements = await Announcement.find(query);

    res.status(200).json({ announcements });
  } catch (error) {
    next(error);
  }
};

export const getIndividualAnnouncementDetails: RequestHandler = async (req, res, next) => {
  try {
    //TODO: validate that the user is allowed to see the announcement
    res.status(200).send("Get individual announcement details route works!");
  } catch (error) {
    next(error);
  }
};
