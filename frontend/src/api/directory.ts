import { APIResult, get, handleAPIError } from "./requests";

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
    const res = await get("/api/directory/public", undefined);

    const raw = (await res.json()) as Counselor[];

    const data = raw.map((c) => ({
      ...c,
      languages: Array.from(new Set(c.languages)),
    }));

    return { success: true, data };
  } catch (error) {
    return handleAPIError(error);
  }
}
