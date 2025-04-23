import { APIResult, handleAPIError, post } from "./requests";

export const createPost = async (postData: {
  title: string;
  message: string;
}): Promise<APIResult<null>> => {
  try {
    await post("/api/discussion", postData);
    return { success: true, data: null };
  } catch (error) {
    return handleAPIError(error);
  }
};
