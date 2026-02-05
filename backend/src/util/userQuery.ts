import { UserRole } from "../models/user";

export type UserQueryFilters = {
  search?: string;
  isAdmin?: string;
  inDirectory?: string;
  title?: string[];
  membership?: string[];
  education?: string[];
  services?: string[];
  country?: string[];
};

/**
 * Builds a MongoDB query object based on the provided filters
 */
export const buildUserQuery = (filters: UserQueryFilters) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const queryFilters: any[] = [];

  // Text search
  if (filters.search) {
    queryFilters.push({
      $or: [
        { "personal.firstName": { $regex: filters.search, $options: "i" } },
        { "personal.lastName": { $regex: filters.search, $options: "i" } },
      ],
    });
  }

  if (filters.isAdmin === "true") {
    queryFilters.push({
      $or: [{ role: UserRole.SUPERADMIN }, { role: UserRole.ADMIN }],
    });
  } else if (filters.isAdmin === "false") {
    queryFilters.push({
      role: UserRole.MEMBER,
    });
  }

  if (filters.inDirectory !== undefined && filters.inDirectory !== "") {
    queryFilters.push({
      "account.inDirectory":
        filters.inDirectory === "true"
          ? true
          : filters.inDirectory === "false"
            ? false
            : filters.inDirectory,
    });
  }

  if (filters.title && filters.title.length > 0) {
    queryFilters.push({
      "professional.title": { $in: filters.title },
    });
  }

  if (filters.membership && filters.membership.length > 0) {
    queryFilters.push({
      "account.membership": { $in: filters.membership },
    });
  }

  if (filters.education && filters.education.length > 0) {
    queryFilters.push({
      "education.degree": { $in: filters.education },
    });
  }

  if (filters.services && filters.services.length > 0) {
    queryFilters.push({
      "display.services": { $in: filters.services },
    });
  }

  if (filters.country && filters.country.length > 0) {
    queryFilters.push({
      "clinic.location.country": { $in: filters.country },
    });
  }

  return queryFilters.length > 0 ? { $and: queryFilters } : {};
};
