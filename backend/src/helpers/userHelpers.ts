import UserModel from "../models/user"; // Adjust path to your user model

export const getUserNameById = async (userId: string): Promise<string> => {
  try {
    const user = await UserModel.findById(userId).lean();
    if (!user) return "Unknown";
    return `${user.personal?.firstName ?? "Unknown"} ${user.personal?.lastName ?? ""}`.trim();
  } catch (error) {
    console.error("Error fetching user by ID:", error);
    return "Unknown";
  }
};
