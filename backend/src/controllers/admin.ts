import { RequestHandler } from "express";
import User from "../models/user";

/**
 * Get all admin users with formatted fields for the table
 */
export const getAllAdmins: RequestHandler = async (req, res, next) => {
  try {
    const admins = await User.find({ role: "admin" })
      .select("personal professional account clinic display")
      .lean();

    const formattedAdmins = admins.map((admin) => ({
      id: admin._id,
      name: `${admin.personal?.firstName ?? ""} ${admin.personal?.lastName ?? ""}`.trim(),
      title: admin.professional?.title ?? "",
      membership: admin.account?.membership ?? "",
      location: admin.clinic?.location?.country ?? "",
      language: [
        ...(admin.display?.languages ?? []),
        ...(admin.professional?.prefLanguages ?? []),
        admin.professional?.otherPrefLanguages ?? "",
      ]
        .filter(Boolean)
        .join(", "),
      service: (admin.display?.services ?? []).join(", "),
    }));

    res.status(200).json({ admins: formattedAdmins });
  } catch (error) {
    console.error("Error fetching admins:", error);
    next(error);
  }
};
