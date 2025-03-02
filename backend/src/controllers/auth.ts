import { NextFunction, Request, Response } from "express";

import { User, users } from "../controllers/user";

const DEFAULT_ERROR = 403;

type AuthRequestBody = {
  id: string;
};

export type AuthenticatedRequest = {
  userUid?: string;
  body: AuthRequestBody;
} & Request;

export const requireSignedIn = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.userUid) {
      res.status(DEFAULT_ERROR).send("User not signed in");
      return;
    }
    next();
  } catch (error) {
    console.log("Error querying user: ", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const requireAdmin = (
  req: Request<unknown, unknown, AuthRequestBody>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = String(req.body.id);
    if (!userId) {
      res.status(DEFAULT_ERROR).send("User ID is required");
      return;
    }
    const user = users.find((u: User) => u.id === parseInt(userId, 10));
    if (!user || user.accountType !== "admin") {
      res.status(DEFAULT_ERROR).send("User is not an admin");
      return;
    }
    next();
  } catch (error) {
    console.log("Error querying user: ", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const requireSuperAdmin = (
  req: Request<unknown, unknown, AuthRequestBody>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = String(req.body.id);
    if (!userId) {
      res.status(DEFAULT_ERROR).send("User ID is required");
      return;
    }
    const user = users.find((u: User) => u.id === parseInt(userId, 10));
    if (!user || user.accountType !== "superadmin") {
      res.status(DEFAULT_ERROR).send("User is not a super admin");
      return;
    }
    next();
  } catch (error) {
    console.log("Error querying user: ", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const requireAdminOrSuperAdmin = (
  req: Request<unknown, unknown, AuthRequestBody>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = String(req.body.id);
    if (!userId) {
      res.status(DEFAULT_ERROR).send("User ID is required");
      return;
    }
    const user = users.find((u: User) => u.id === parseInt(userId, 10));
    if (!user || !["admin", "superadmin"].includes(user.accountType || "")) {
      res.status(DEFAULT_ERROR).send("User is not an admin or super admin");
      return;
    }
    next();
  } catch (error) {
    console.log("Error querying user: ", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
