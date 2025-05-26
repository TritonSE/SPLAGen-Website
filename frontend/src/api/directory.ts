import { APIResult, handleAPIError, post } from "./requests";

export type Counselor = {
  name: string;
  title: string;
  address: string;
  organization: string;
  email: string;
  phone: string;
  specialties: string[];
  languages: string[];
  profileUrl: string;
};

export async function getPublicDirectory(): Promise<APIResult<Counselor[]>> {
  try {
    const res = await post("/api/directory/public", undefined);

    const data = (await res.json()) as Counselor[];

    return { success: true, data };
  } catch (error) {
    return handleAPIError(error);
  }
}
