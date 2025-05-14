import { APIResult, get, handleAPIError, post } from "./requests";

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

export const createPost = async (postData: {
  title: string;
  message: string;
}): Promise<APIResult<Discussion>> => {
  try {
    const response: Response = await post("/api/discussions", postData);
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

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const data: Discussion[] = await response.json();

    return { success: true, data };
  } catch (error) {
    return handleAPIError(error);
  }
};
