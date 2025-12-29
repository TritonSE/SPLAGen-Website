import { NextFunction, RequestHandler, Response } from "express";

import { AuthenticatedRequest } from "../middleware/auth";
import AnnouncementModel, { Announcement } from "../models/announcement";
import { UserRole } from "../models/user";

type CreateOrEditAnnouncementRequestBody = {
  title: string;
  message: string;
  recipients: string[];
};

export const createAnnouncement = async (
  req: AuthenticatedRequest<unknown, unknown, CreateOrEditAnnouncementRequestBody>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { title, message, recipients } = req.body;
    const userId = req.mongoID;

    const newAnnouncement = new AnnouncementModel({ userId, title, message, recipients });

    await newAnnouncement.save();
    res.status(201).json(newAnnouncement);
  } catch (error) {
    next(error);
  }
};

export const editAnnouncement = async (
  req: AuthenticatedRequest<{ id: string }, unknown, CreateOrEditAnnouncementRequestBody>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const { title, message, recipients } = req.body;

    const result = await AnnouncementModel.findByIdAndUpdate(
      { _id: id },
      { $set: { title, message, recipients } },
      { returnDocument: "after" },
    );

    if (!result) {
      res.status(400).json({ error: "Announcement not updated" });
      return;
    }

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const deleteAnnouncement: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await AnnouncementModel.deleteOne({ _id: id });
    if (!result.acknowledged) {
      res.status(400).json({ error: "Announcement was not deleted" });
      return;
    }

    res.status(200).json({ message: "Announcement deleted successfully" });
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
    const order = req.query.order;
    const newestFirst = order === "newest";
    const searchTerm = req.query.search;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : null;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const filters: any[] = [];

    // Non-admins only see relevant announcements
    if (![UserRole.ADMIN, UserRole.SUPERADMIN].includes(userRole as UserRole)) {
      // If the user is not an admin or super admin, filter announcements by their email
      filters.push({ recipients: { $in: [userEmail, "everyone"] } });
    }

    // Text search
    if (searchTerm) {
      filters.push({
        $text: { $search: searchTerm },
      });
    }

    const query = filters.length > 0 ? { $and: filters } : {};

    let mongoQuery = AnnouncementModel.find(query)
      .sort({
        createdAt: newestFirst ? -1 : 1,
      })
      .populate("userId");
    if (limit) {
      mongoQuery = mongoQuery.limit(limit);
    }

    const announcements = await mongoQuery;

    res.status(200).json(announcements);
  } catch (error) {
    next(error);
  }
};

export const getIndividualAnnouncementDetails = async (
  req: AuthenticatedRequest<{ id: string }>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const userRole = req.role;
    const userEmail = req.userEmail;

    const announcement = (await AnnouncementModel.findOne({ _id: id }).populate(
      "userId",
    )) as Announcement;

    if (announcement === null) {
      res.status(404).send("Announcement not found");
      return;
    }

    if (
      ![UserRole.ADMIN, UserRole.SUPERADMIN].includes(userRole as UserRole) &&
      !announcement.recipients.includes("everyone") &&
      (!userEmail || !announcement.recipients.includes(userEmail))
    ) {
      res
        .status(403)
        .json({ error: "Unauthorized: You can only view announcements addressed to you" });
      return;
    }

    res.status(200).json(announcement);
  } catch (error) {
    next(error);
  }
};
