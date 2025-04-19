import UserModel, { User } from "../models/user";

import { firebaseAdminAuth } from "./firebase";

// delete user from Firebase
export const deleteUserFromFirebase = async (userId: string): Promise<void> => {
  await firebaseAdminAuth.deleteUser(userId);
};

// delete user from MongoDB
export const deleteUserFromMongoDB = async (userId: string): Promise<void> => {
  await UserModel.deleteOne({ firebaseId: userId });
};

// get user from MongoDB
export const getUserFromMongoDB = async (userId: string): Promise<User | null> => {
  const user = await UserModel.findOne({ firebaseId: userId });
  return user;
};
