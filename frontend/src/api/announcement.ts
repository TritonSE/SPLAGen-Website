import { APIResult, get, handleAPIError, post } from "./requests";
import { createAuthHeader } from "./users";

export type Announcement = {
  _id: string;
  title: string;
  message: string;
  createdAt: string; // Date string, could be parsed into a Date object later
  userId: string; // The author's user ID
  recipients: string | string[];
  updatedAt?: string;
};

export const createPost = async (
  postData: {
    title: string;
    message: string;
  },
  firebaseToken: string,
): Promise<APIResult<Announcement>> => {
  try {
    const response: Response = await post(
      "/api/announcements",
      postData,
      createAuthHeader(firebaseToken),
    );
    const data = (await response.json()) as Announcement;

    return { success: true, data };
  } catch (error) {
    return handleAPIError(error);
  }
};

export const getPost = async (firebaseToken: string): Promise<APIResult<Announcement[]>> => {
  try {
    const response: Response = await get("/api/announcements", createAuthHeader(firebaseToken));

    if (!response.ok) {
      return handleAPIError("Failed to fetch posts");
    }

    const json: unknown = await response.json();

    if (typeof window !== "undefined") {
      console.info("Fetched posts JSON:", json);
    }

    if (Array.isArray(json)) {
      return { success: true, data: json as Announcement[] };
    } else if (
      typeof json === "object" &&
      json !== null &&
      "announcements" in json &&
      Array.isArray((json as { announcements: unknown }).announcements)
    ) {
      return {
        success: true,
        data: (json as { announcements: Announcement[] }).announcements,
      };
    } else {
      console.log("API returned:", json);
      console.log("API returned:", JSON.stringify(json, null, 2));

      return handleAPIError("Unexpected response format from API.");
    }
  } catch (error) {
    return handleAPIError(error);
  }
};
