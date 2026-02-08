import { APIResult, get, handleAPIError, post } from "./requests";
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

export async function removeAdmins(
  firebaseToken: string,
  userIds: string[],
  reason: string,
): Promise<APIResult<null>> {
  try {
    await post(
      "/api/admin/remove",
      {
        userIds,
        reason,
      },
      createAuthHeader(firebaseToken),
    );
    return { success: true, data: null };
  } catch (error) {
    return handleAPIError(error);
  }
}

export async function inviteAdmin(firebaseToken: string, userId: string): Promise<APIResult<null>> {
  try {
    await post(`/api/admin/invite/${userId}`, undefined, createAuthHeader(firebaseToken));
    return { success: true, data: null };
  } catch (error) {
    return handleAPIError(error);
  }
}
