type Method = "GET" | "POST" | "PUT";

export async function editBasicInfoRequest(
  method: Method,
  url: string,
  body: unknown,
  headers: Record<string, string>,
): Promise<Response> {
  const hasBody = body !== undefined;

  const newHeaders = { ...headers };
  if (hasBody) {
    newHeaders["Content-Type"] = "application/json";
  }

  const response = await fetch(url, {
    method,
    headers: newHeaders,
    body: hasBody ? JSON.stringify(body) : undefined,
  });

  return response;
}
