import { Request } from "express";

/**
 * Constructs the deployment URL from the request headers.
 * Prefers the origin header, falls back to protocol + host.
 *
 * @param req - Express request object
 * @returns The base deployment URL (e.g., "https://example.com")
 */
export const getDeploymentUrl = (req: Request): string => {
  return req.get("origin") ?? `${req.protocol}://${req.get("host") ?? ""}`;
};
