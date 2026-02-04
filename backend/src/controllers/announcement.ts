import { NextFunction, RequestHandler, Response } from "express";

import { AuthenticatedRequest } from "../middleware/auth";
import AnnouncementModel, { Announcement } from "../models/announcement";
import UserModel, { User, UserRole } from "../models/user";
import { sendAnnouncementEmail } from "../services/emailService";
import { getDeploymentUrl } from "../utils/urlHelper";

type CreateOrEditAnnouncementRequestBody = {
  title: string;
  message: string;
  recipients: string[];
};

export const createAnnouncement = async (
  req: AuthenticatedRequest<Record<string, string>, unknown, CreateOrEditAnnouncementRequestBody>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { title, message, recipients } = req.body;
    const userId = req.mongoID;

    const newAnnouncement = new AnnouncementModel({ userId, title, message, recipients });

    await newAnnouncement.save();

    // Get author information for email notification
    const author = await UserModel.findById(userId);
    if (!author) {
      res.status(201).json(newAnnouncement);
      return;
    }

    const authorName =
      `${author.personal?.firstName ?? ""} ${author.personal?.lastName ?? ""}`.trim() ||
      "SPLAGen Admin";

    // Get the deployment URL from the request
    const deploymentUrl = getDeploymentUrl(req);
    const announcementUrl = `${deploymentUrl}/announcements/${newAnnouncement._id.toString()}`;

    // Determine recipients for email
    let emailRecipients: User[] = [];

    if (recipients[0] === "everyone") {
      // Get all users' emails
      const allUsers = await UserModel.find({}, "personal.email personal.firstName");
      emailRecipients = allUsers;
    } else {
      // Get specific users by email
      const specificUsers = await UserModel.find(
        { "personal.email": { $in: recipients } },
        "personal.email personal.firstName",
      );
      emailRecipients = specificUsers;
    }

    // Send emails asynchronously (don't wait for completion)
    Promise.all(
      emailRecipients.map((recipient) =>
        recipient.personal
          ? sendAnnouncementEmail(
              recipient.personal.email,
              recipient.personal.firstName,
              authorName,
              title,
              message,
              announcementUrl,
            ).catch((error: unknown) => {
              console.error(`Failed to send email to ${recipient.personal?.email ?? ""}:`, error);
            })
          : Promise.resolve(),
      ),
    ).catch((error: unknown) => {
      console.error("Error sending announcement emails:", error);
    });

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
    const page = parseInt(req.query.page as string);
    const pageSize = parseInt(req.query.pageSize as string);

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

    const total = await AnnouncementModel.countDocuments(query);

    const announcements = await AnnouncementModel.find(query)
      .sort({
        createdAt: newestFirst ? -1 : 1,
      })
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .populate("userId");

    res.status(200).json({ announcements, count: total });
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
