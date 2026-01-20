import { APIResult, get, handleAPIError, post } from "./requests";
import { createAuthHeader } from "./users";

export type Counselor = {
  name: string;
  title: string;
  address: string;
  organization: string;
  email: string;
  phone: string;
  specialties: string[];
  languages: string[];
  profileUrl: string;
};

export type JoinDirectoryRequestBody = {
  education: {
    degree: string;
    otherDegree?: string;
    institution: string;
  };
  clinic: {
    name: string;
    url: string;
    location: {
      country: string;
      address: string;
      suite?: string;
      city: string;
      state: string;
      zipPostCode: string;
    };
  };
  display: {
    workEmail: string;
    workPhone: string;
    services: string[];
    languages: string[];
    license: string[];
    options: {
      openToAppointments: boolean;
      openToRequests: boolean;
      remote: boolean;
      authorizedCare: string | boolean;
    };
    comments: {
      noLicense?: string;
      additional?: string;
    };
  };
};

export async function joinDirectory(
  joinDirectoryRequest: JoinDirectoryRequestBody,
  firebaseToken: string,
): Promise<APIResult<null>> {
  try {
    await post("/api/directory/join", joinDirectoryRequest, createAuthHeader(firebaseToken));

    return { success: true, data: null };
  } catch (error) {
    return handleAPIError(error);
  }
}

export async function getPublicDirectory(): Promise<APIResult<Counselor[]>> {
  try {
    const res = await get("/api/directory/public", undefined);

    const raw = (await res.json()) as Counselor[];

    const data = raw.map((c) => ({
      ...c,
      languages: Array.from(new Set(c.languages)),
    }));

    return { success: true, data };
  } catch (error) {
    return handleAPIError(error);
  }
}

export async function approveDirectoryEntry(
  firebaseToken: string,
  userIds: string[],
): Promise<APIResult<null>> {
  try {
    await post(
      "/api/directory/approve",
      {
        userIds,
      },
      createAuthHeader(firebaseToken),
    );
    return { success: true, data: null };
  } catch (error) {
    return handleAPIError(error);
  }
}

export async function denyDirectoryEntry(
  firebaseToken: string,
  userIds: string[],
  reason: string,
): Promise<APIResult<null>> {
  try {
    await post(
      "/api/directory/deny",
      {
        userIds,
        reason,
      },
      createAuthHeader(firebaseToken),
    );
    return { success: true, data: null };
  } catch (error) {
    return handleAPIError(error);
  }
}
