export async function parseJsonResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  const contentType = response.headers.get("content-type") || "";

  if (!contentType.includes("application/json")) {
    const body = await response.text();

    if (body.trim().startsWith("<")) {
      throw new Error(
        "The API request returned HTML instead of JSON. Check REACT_APP_API_SERVER_HOST and make sure the mock or API server is running.",
      );
    }

    throw new Error(
      `Expected JSON but received '${contentType || "unknown content type"}'.`,
    );
  }

  return response.json() as Promise<T>;
}

export function getApiHostErrorMessage(apiHost: string): string | null {
  if (!apiHost) {
    return "REACT_APP_API_SERVER_HOST is not set. Point it to your API or mock server, for example http://localhost:3001, then restart the React dev server.";
  }

  return null;
}
