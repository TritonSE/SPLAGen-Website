import { APIResult, get, handleAPIError, post } from "./requests";
import { createAuthHeader } from "./users";

// Assuming the structure of a Discussion item
export type Discussion = {
  userName: string;
  _id: string;
  title: string;
  message: string;
  createdAt: string;
  userId: string;
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

export const getPost = async (token: string): Promise<APIResult<Discussion[]>> => {
  try {
    const response: Response = await get("/api/discussions", createAuthHeader(token));

    if (!response.ok) {
      return handleAPIError("Failed to fetch posts");
    }

    const json = (await response.json()) as Discussion[];
    return { success: true, data: json };
  } catch (error) {
    return handleAPIError(error);
  }
};
