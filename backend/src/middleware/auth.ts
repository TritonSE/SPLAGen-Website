import { NextFunction, Request, Response } from "express";
import admin from "firebase-admin"; // Import Firebase Admin SDK
import { Types } from "mongoose";

import UserModel, { UserRole } from "../models/user";

const DEFAULT_ERROR = 403;

// Define this custom type for a request to include the "firebaseUid"
export type AuthenticatedRequest<P = unknown, ResBody = unknown, ReqBody = unknown> = Request<
  P,
  ResBody,
  ReqBody
> & {
  firebaseUid?: string;
  mongoID?: Types.ObjectId;
  role?: string;
  userEmail?: string;
};

// Firebase Authentication Verification
const verifyFirebaseToken = async (token: string) => {
  try {
    // Verify Firebase token using Firebase Admin SDK
    const decodedToken = await admin.auth().verifyIdToken(token);
    return decodedToken; // returns decoded user data, including UID
  } catch (error) {
    console.error("Error verifying Firebase token:", error);
    throw new Error("Token is invalid");
  }
};

// Middleware to require the user to be signed in with a valid Firebase token
export const requireSignedIn = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  // Extract the Firebase token from the "Authorization" header
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    res.status(403).send("Authorization token is missing or invalid.");
    return;
  }

  const token = authHeader.split("Bearer ")[1];

  try {
    // Verify the Firebase ID token
    const decodedToken = await verifyFirebaseToken(token);

    if (decodedToken.email === undefined || !decodedToken.email_verified) {
      res.status(403).json({ error: "Please verify your email first!" });
      return;
    }

    // Fetch the user from MongoDB using the firebaseUid
    const user = await UserModel.findOne({ firebaseId: decodedToken.uid });

    if (!user) {
      res.status(401).send("User not found.");
      return;
    }

    // Attach user details to the request object for downstream routes
    req.firebaseUid = decodedToken.uid;
    req.role = user.role;
    req.mongoID = user._id;
    req.userEmail = user.personal?.email;

    next();
  } catch (error) {
    console.error("Firebase token verification failed:", error);
    res.status(401).send("Token verification failed. Please log in again.");
    return;
  }
};

// Middleware to require the user to be an admin or superadmin
export const requireAdminOrSuperAdmin = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { firebaseUid } = req;
    const user = await UserModel.findOne({ firebaseId: firebaseUid });

    if (!user || ![UserRole.ADMIN, UserRole.SUPERADMIN].includes(user.role as UserRole)) {
      //return res.status(DEFAULT_ERROR).send("User is not an admin or super admin");
      next(new Error("User is not an admin or super admin"));
      return;
    }

    next();
  } catch (error) {
    next(error);
  }
};

// Middleware to require the user to be a superadmin
export const requireSuperAdmin = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { firebaseUid } = req;
    const user = await UserModel.findOne({ firebaseId: firebaseUid });

    if (!user || user.role !== UserRole.SUPERADMIN) {
      res.status(DEFAULT_ERROR).send("User is not a super admin");
      return;
    }

    next();
  } catch (error) {
    next(error);
  }
};
