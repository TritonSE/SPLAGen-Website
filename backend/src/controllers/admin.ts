import { RequestHandler } from "express";

import User from "../models/user";

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
