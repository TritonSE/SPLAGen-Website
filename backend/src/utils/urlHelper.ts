/**
 * Constructs the deployment URL from the request headers.
 * Prefers the origin header, falls back to protocol + host.
 *
 * Typed structurally so any Express request shape works, regardless of the
 * generic param/body types in its declaration site.
 *
 * @param req - Express request object (or anything with `.get()` and `.protocol`)
 * @returns The base deployment URL (e.g., "https://example.com")
 */
export const getDeploymentUrl = (req: {
  get: (header: string) => string | undefined;
  protocol: string;
}): string => {
  return req.get("origin") ?? `${req.protocol}://${req.get("host") ?? ""}`;
};
