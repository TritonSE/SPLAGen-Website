export type PostResponse = {
  success: boolean;
  message: string;
};

export const createPost = async (postData: {
  title: string;
  message: string;
}): Promise<PostResponse> => {
  const response = await fetch("/api/discussion", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(postData),
  });

  if (!response.ok) {
    const errorData = (await response.json()) as { message?: string };
    throw new Error(errorData.message ?? "Failed to create post");
  }

  const responseData = (await response.json()) as PostResponse;
  return responseData;
};
