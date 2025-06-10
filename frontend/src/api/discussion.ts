import { APIResult, handleAPIError, post } from "./requests";
import { createAuthHeader } from "./users";

// Assuming the structure of a Discussion item
export type Discussion = {
  _id: string;
  title: string;
  message: string;
  createdAt: string; // Date string, could be parsed into a Date object later
  userId: string; // The author's user ID
  audience?: string;
  time?: string;
};

export const createPost = async (
  postData: {
    title: string;
    message: string;
  },
  firebaseToken: string,
): Promise<APIResult<Discussion>> => {
  try {
    const response: Response = await post(
      "/api/discussions",
      postData,
      createAuthHeader(firebaseToken),
    );
    const data = (await response.json()) as Discussion;

    return { success: true, data };
  } catch (error) {
    return handleAPIError(error);
  }
};

export const getPost = async (): Promise<APIResult<Discussion[]>> => {
  try {
    const response: Response = await get("/api/discussions");

    if (!response.ok) {
      return handleAPIError("Failed to fetch posts");
    }

    const json: unknown = await response.json();

    if (typeof window !== "undefined") {
      console.info("Fetched posts JSON:", json);
    }

    if (Array.isArray(json)) {
      return { success: true, data: json as Discussion[] };
    } else if (
      typeof json === "object" &&
      json !== null &&
      "posts" in json &&
      Array.isArray((json as { posts: unknown }).posts)
    ) {
      return {
        success: true,
        data: (json as { posts: Discussion[] }).posts,
      };
    } else {
      return handleAPIError("Unexpected response format from API.");
    }
  } catch (error) {
    return handleAPIError(error);
  }
};
