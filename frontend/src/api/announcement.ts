import { APIResult, get, handleAPIError, httpDelete, post, put } from "./requests";
import { User, createAuthHeader } from "./users";

// Assuming the structure of a Announcement item
export type Announcement = {
  _id: string;
  title: string;
  message: string;
  recipients: string[];
  createdAt: string;
  updatedAt: string;
  userId: User;
};

export type PaginatedAnnouncementResult = {
  announcements: Announcement[];
  count: number;
};

export const createAnnouncement = async (
  announcementData: {
    title: string;
    message: string;
    recipients: string[];
  },
  firebaseToken: string,
): Promise<APIResult<Announcement>> => {
  try {
    const response = await post(
      "/api/announcements",
      announcementData,
      createAuthHeader(firebaseToken),
    );
    const data = (await response.json()) as Announcement;

    return { success: true, data };
  } catch (error) {
    return handleAPIError(error);
  }
};

export const ANNOUNCEMENTS_PAGE_SIZE = 5;

export const getAnnouncements = async (
  token: string,
  sort: string,
  search: string,
  page: number,
  pageSize = ANNOUNCEMENTS_PAGE_SIZE,
): Promise<APIResult<PaginatedAnnouncementResult>> => {
  try {
    const response = await get(
      `/api/announcements?order=${sort}&search=${search}&page=${String(page)}&pageSize=${String(pageSize)}`,
      createAuthHeader(token),
    );

    const json = (await response.json()) as PaginatedAnnouncementResult;
    return { success: true, data: json };
  } catch (error) {
    return handleAPIError(error);
  }
};

export const getIndividualAnnouncement = async (
  token: string,
  announcementId: string,
): Promise<APIResult<Announcement>> => {
  try {
    const response = await get(`/api/announcements/${announcementId}`, createAuthHeader(token));

    const json = (await response.json()) as Announcement;
    return { success: true, data: json };
  } catch (error) {
    return handleAPIError(error);
  }
};

export const updateAnnouncement = async (
  token: string,
  announcementId: string,
  announcementData: {
    title: string;
    message: string;
    recipients: string[];
  },
): Promise<APIResult<Announcement>> => {
  try {
    const response = await put(
      `/api/announcements/${announcementId}`,
      announcementData,
      createAuthHeader(token),
    );

    const json = (await response.json()) as Announcement;
    return { success: true, data: json };
  } catch (error) {
    return handleAPIError(error);
  }
};

export const deleteAnnouncement = async (
  token: string,
  announcementId: string,
): Promise<APIResult<null>> => {
  try {
    await httpDelete(`/api/announcements/${announcementId}`, createAuthHeader(token));
    return { success: true, data: null };
  } catch (error) {
    return handleAPIError(error);
  }
};
