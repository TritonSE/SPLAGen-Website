import { NextFunction, RequestHandler, Response } from "express";

import { AuthenticatedRequest } from "../middleware/auth";
import User, { UserRole } from "../models/user";
import { sendAdminInvitationEmail, sendAdminRemovalEmail } from "../services/emailService";
import { getDeploymentUrl } from "../utils/urlHelper";

type RemoveAdminsRequestBody = {
  userIds: string[];
  reason: string;
};

/**
 * Retrieve statistics on the number of members & admins
 */
export const getMemberStats: RequestHandler = async (req, res, next) => {
  try {
    const memberCount = await User.countDocuments();
    const directoryCount = await User.countDocuments({ account: { inDirectory: true } });
    const adminCount = await User.countDocuments({
      role: { $in: [UserRole.ADMIN, UserRole.SUPERADMIN] },
    });

    res.status(200).json({
      memberCount,
      directoryCount,
      adminCount,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Invite a user to become an admin
 */
export const inviteAdmin: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user?.personal) {
      res.status(404).send("User not found");
      return;
    }

    if (([UserRole.ADMIN, UserRole.SUPERADMIN] as string[]).includes(user.role)) {
      res.status(400).send("User is already an admin or superadmin");
      return;
    }

    user.role = UserRole.ADMIN;
    await user.save();

    const deploymentUrl = getDeploymentUrl(req);
    await sendAdminInvitationEmail(user.personal.email, user.personal.firstName, deploymentUrl);

    res.status(200).json({
      message: "User invited successfully",
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Remove one or more admins
 */
export const removeAdmins = async (
  req: AuthenticatedRequest<unknown, unknown, RemoveAdminsRequestBody>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { userIds, reason } = req.body;
    const errorMap: Record<string, string> = {};

    await Promise.all(
      userIds.map(async (userId) => {
        const user = await User.findById(userId);
        if (!user?.personal) {
          errorMap[userId] = "User not found";
          return;
        }

        user.role = UserRole.MEMBER;
        await user.save();

        await sendAdminRemovalEmail(user.personal.email, user.personal.firstName, reason);
      }),
    );

    if (Object.keys(errorMap).length > 0) {
      res.status(400).json(errorMap);
    }

    res.status(200).json({
      message: "Admins removed successfully",
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get all admin users with formatted fields for the table & popup
 */
export const getAllAdmins: RequestHandler = async (req, res, next) => {
  try {
    const admins = await User.find({ role: "admin" })
      .select("personal professional account clinic display createdAt")
      .lean();

    const formattedAdmins = admins.map((admin) => {
      const allLanguages = new Set<string>();

      if (Array.isArray(admin.display?.languages)) {
        admin.display.languages.forEach((lang) => lang && allLanguages.add(lang.trim()));
      }
      if (Array.isArray(admin.professional?.prefLanguages)) {
        admin.professional.prefLanguages.forEach((lang) => lang && allLanguages.add(lang.trim()));
      }
      if (admin.professional?.otherPrefLanguages?.trim()) {
        allLanguages.add(admin.professional.otherPrefLanguages.trim());
      }

      const fullAddress = [
        admin.clinic?.location?.address ?? "",
        admin.clinic?.location?.suite ?? "",
        admin.clinic?.location?.country ?? "",
      ]
        .filter(Boolean)
        .join(", ");

      return {
        id: admin._id,
        name: `${admin.personal?.firstName ?? ""} ${admin.personal?.lastName ?? ""}`.trim(),
        email: admin.personal?.email ?? "",
        phone: admin.personal?.phone ?? "",
        title: admin.professional?.title ?? "",
        membership: admin.account?.membership ?? "",
        education: admin.education?.degree ?? "",
        joined: admin.createdAt ? new Date(admin.createdAt).toISOString().split("T")[0] : "",
        hospital: admin.clinic?.name ?? "",
        location: {
          address: fullAddress,
          country: admin.clinic?.location?.country ?? "",
          hospital: admin.clinic?.name ?? "",
        },
        language: Array.from(allLanguages),
        service: admin.display?.services ?? [],
      };
    });

    res.status(200).json({ admins: formattedAdmins });
  } catch (error) {
    console.error("Error fetching admins:", error);
    next(error);
  }
};
