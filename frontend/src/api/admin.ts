import { APIResult, get, handleAPIError } from "./requests";
import { createAuthHeader } from "./users";

export type MemberStats = {
  memberCount: number;
  directoryCount: number;
  adminCount: number;
};

export const getMemberStats = async (token: string): Promise<APIResult<MemberStats>> => {
  try {
    const response = await get("/api/admin/memberStats", createAuthHeader(token));

    const json = (await response.json()) as MemberStats;
    return { success: true, data: json };
  } catch (error) {
    return handleAPIError(error);
  }
};
