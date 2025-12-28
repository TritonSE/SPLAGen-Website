import { APIResult, get, handleAPIError, httpDelete, post, put } from "./requests";
import { User, createAuthHeader } from "./users";

export type Reply = {
  _id: string;
  message: string;
  postId: string;
  createdAt: string;
  updatedAt: string;
  userId: User;
};

export const createReply = async (
  firebaseToken: string,
  postId: string,
  message: string,
): Promise<APIResult<Reply>> => {
  try {
    const response = await post(
      "/api/replies",
      { message, postId },
      createAuthHeader(firebaseToken),
    );
    const data = (await response.json()) as Reply;

    return { success: true, data };
  } catch (error) {
    return handleAPIError(error);
  }
};

export const getReplies = async (token: string, postId: string): Promise<APIResult<Reply[]>> => {
  try {
    const response = await get(`/api/replies/${postId}`, createAuthHeader(token));

    const json = (await response.json()) as Reply[];
    return { success: true, data: json };
  } catch (error) {
    return handleAPIError(error);
  }
};

export const updateReply = async (
  token: string,
  replyId: string,
  message: string,
): Promise<APIResult<Reply>> => {
  try {
    const response = await put(`/api/replies/${replyId}`, { message }, createAuthHeader(token));

    const json = (await response.json()) as Reply;
    return { success: true, data: json };
  } catch (error) {
    return handleAPIError(error);
  }
};

export const deleteReply = async (token: string, replyId: string): Promise<APIResult<null>> => {
  try {
    await httpDelete(`/api/replies/${replyId}`, createAuthHeader(token));
    return { success: true, data: null };
  } catch (error) {
    return handleAPIError(error);
  }
};
