import { APIResult, get, handleAPIError, httpDelete, post, put } from "./requests";
import { User, createAuthHeader } from "./users";

// Assuming the structure of a Discussion item
export type Discussion = {
  _id: string;
  title: string;
  message: string;
  createdAt: string;
  updatedAt: string;
  userId: User;
};

export type PaginatedDiscussionResult = {
  discussions: Discussion[];
  count: number;
};

export const createPost = async (
  postData: {
    title: string;
    message: string;
  },
  firebaseToken: string,
): Promise<APIResult<Discussion>> => {
  try {
    const response = await post("/api/discussions", postData, createAuthHeader(firebaseToken));
    const data = (await response.json()) as Discussion;

    return { success: true, data };
  } catch (error) {
    return handleAPIError(error);
  }
};

export const DISCUSSION_PAGE_SIZE = 5;

export const getPosts = async (
  token: string,
  sort: string,
  search: string,
  mineOnly: boolean,
  page: number,
  pageSize = DISCUSSION_PAGE_SIZE,
): Promise<APIResult<PaginatedDiscussionResult>> => {
  try {
    const response = await get(
      `/api/discussions?page=${String(page)}&pageSize=${String(pageSize)}&order=${sort}&search=${search}&mine=${mineOnly ? "true" : "false"}`,
      createAuthHeader(token),
    );

    const json = (await response.json()) as PaginatedDiscussionResult;
    return { success: true, data: json };
  } catch (error) {
    return handleAPIError(error);
  }
};

export const getIndividualPost = async (
  token: string,
  discussionId: string,
): Promise<APIResult<Discussion>> => {
  try {
    const response = await get(`/api/discussions/${discussionId}`, createAuthHeader(token));

    const json = (await response.json()) as Discussion;
    return { success: true, data: json };
  } catch (error) {
    return handleAPIError(error);
  }
};

export const updateDiscussion = async (
  token: string,
  discussionId: string,
  discussionData: {
    title: string;
    message: string;
  },
): Promise<APIResult<Discussion>> => {
  try {
    const response = await put(
      `/api/discussions/${discussionId}`,
      discussionData,
      createAuthHeader(token),
    );

    const json = (await response.json()) as Discussion;
    return { success: true, data: json };
  } catch (error) {
    return handleAPIError(error);
  }
};

export const deleteDiscussion = async (
  token: string,
  discussionId: string,
): Promise<APIResult<null>> => {
  try {
    await httpDelete(`/api/discussions/${discussionId}`, createAuthHeader(token));
    return { success: true, data: null };
  } catch (error) {
    return handleAPIError(error);
  }
};
