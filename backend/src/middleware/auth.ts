import { Request, Response, NextFunction } from "express";
import { decodeAuthToken } from "../services/auth";
import { AuthError } from "../errors/auth";
import UserModel, { UserRole } from "../models/user";

/**
 * Define this custom type for a request to include the "userUid"
 * property, which middleware will set and validate
 */
export interface SPLAGENRequest extends Request {
  userUid?: string;
}

/**
 * A middleware that requires the user to be signed in and have a valid Firebase token
 * in the "Authorization" header
 */
const requireSignedIn = async (
  req: SPLAGENRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.split("Bearer ")[1];
    if (!token) {
      res
        .status(AuthError.TOKEN_NOT_IN_HEADER.status)
        .send(AuthError.TOKEN_NOT_IN_HEADER.displayMessage(true));
      return;
    }

    const userInfo = await decodeAuthToken(token);
    if (!userInfo) {
      res
        .status(AuthError.INVALID_AUTH_TOKEN.status)
        .send(AuthError.INVALID_AUTH_TOKEN.displayMessage(true));
      return;
    }

    req.userUid = userInfo.uid;
    const user = await UserModel.findOne({ uid: userInfo.uid });
    if (!user) {
      res
        .status(AuthError.USER_NOT_FOUND.status)
        .send(AuthError.USER_NOT_FOUND.displayMessage(true));
      return;
    }

    next(); // Call next() only if everything is valid
  } catch (error) {
    res
      .status(AuthError.INVALID_AUTH_TOKEN.status)
      .send(AuthError.INVALID_AUTH_TOKEN.displayMessage(true));
  }
};


/**
 * A middleware that requires the user to have either the staff or admin role
 */
const requireStaffOrAdmin = async (req: SPLAGENRequest, res: Response, next: NextFunction) => {
  const { userUid } = req;
  const user = await UserModel.findOne({ uid: userUid });
  if (!user || ![UserRole.STAFF, UserRole.ADMIN].includes(user.role as UserRole)) {
    return res
      .status(AuthError.NOT_STAFF_OR_ADMIN.status)
      .send(AuthError.NOT_STAFF_OR_ADMIN.displayMessage(true));
  }
  return next();
};

/**
 * A middleware that requires the user to have the admin role
 */
const requireAdmin = async (
  req: SPLAGENRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { userUid } = req;
  const user = await UserModel.findOne({ uid: userUid });
  if (!user || user.role !== UserRole.ADMIN) {
    res.status(AuthError.NOT_ADMIN.status).send(AuthError.NOT_ADMIN.displayMessage(true));
    return;
  }
  next(); // Call next() only if everything is valid
  return;
};

export { requireSignedIn, requireStaffOrAdmin, requireAdmin };