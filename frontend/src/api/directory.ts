type Counselor = {
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

export const getPublicDirectory = async (): Promise<Counselor[]> => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/directory/public`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch public directory: ${res.statusText}`);
  }

  return res.json();
};
