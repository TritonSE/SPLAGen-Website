import { NextFunction, Request, Response } from "express";
import { Types } from "mongoose";

import UserModel, { UserRole } from "../models/user";

const DEFAULT_ERROR = 403;

/**
 * Define this custom type for a request to include the "userUid"
 * property, which middleware will set and validate
 */
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

/**
 * A middleware that requires the user to be signed in and have a valid Firebase token
 * in the "Authorization" header
 */
export const requireSignedIn = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  // TODO uncomment when Firebase is set up
  // const authHeader = req.headers.authorization;
  // // Token should be "Bearer: <token>"
  // const token = authHeader?.split("Bearer ")[1];
  // if (!token) {
  //  return res.status(401).send("Token was not found in header. Be sure to use Bearer <Token> syntax");
  // }

  // let userInfo;
  // try {
  //   userInfo = await decodeAuthToken(token);
  // } catch (error) {
  //   return res.status(401).send("Token was invalid.");
  // })

  //TODO: remove temporary user info (the line below)
  const userInfo = { uid: "unique-firebase-id-001" }; //MEMBER
  // const userInfo = { uid: "unique-firebase-id-002" }; //admin
  if (userInfo) {
    const user = await UserModel.findOne({ firebaseId: userInfo.uid });

    if (!user) {
      res.status(401).send("User not found");
      return;
    }

    req.firebaseUid = userInfo.uid;
    req.role = user.role;
    req.mongoID = user._id;
    req.userEmail = user.personal?.email;

    next();
    return;
  }

  res.status(401).send("Token was invalid.");
};

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
