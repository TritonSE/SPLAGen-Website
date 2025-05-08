import { NextFunction, Request, Response } from "express";
import { Types } from "mongoose";

import UserModel, { UserRole } from "../models/user";
import { firebaseAdminAuth } from "../util/firebase";
import env from "../util/validateEnv";

const DEFAULT_ERROR = 403;
const SECURITY_BYPASS_ENABLED = env.SECURITY_BYPASS;

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
    const decodedToken = await firebaseAdminAuth.verifyIdToken(token);
    return decodedToken; // returns decoded user data, including UID
  } catch (error) {
    if (!(error instanceof Error)) {
      console.error("Unknown error verifying Firebase token:", error);
      throw new Error(`Token verification failed for token: ${token}. Unknown error occurred.`);
    } else {
      console.error("Error verifying Firebase token:", error);
      throw new Error(`Token verification failed for token: ${token}. Error details: ${error}`);
    }
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

  // Check if the header starts with "Bearer " and if the token is non-empty
  const token = authHeader?.split("Bearer ")[1];

  if (!token) {
    res.status(403).send("Authorization token is missing or invalid.");
    return;
  }

  if (SECURITY_BYPASS_ENABLED) {
    req.firebaseUid = "unique-firebase-id-001";
    const user = await UserModel.findOne({ firebaseId: req.firebaseUid });

    if (!user) {
      res.status(401).send("User not found.");
      return;
    }

    console.warn("[SECURITY BYPASS] Skipping authentication for development mode.");

    req.role = user.role;
    req.mongoID = user._id;
    req.userEmail = user.personal?.email;

    next();
    return;
  }

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
      res.status(DEFAULT_ERROR).send("User is not an admin or super admin");
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
