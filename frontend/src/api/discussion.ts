import { APIResult, handleAPIError, post } from "./requests";
import { createAuthHeader } from "./users";

type Discussion = {
  _id: string;
  userId: string;
  title: string;
  message: string;
  channel: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
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
