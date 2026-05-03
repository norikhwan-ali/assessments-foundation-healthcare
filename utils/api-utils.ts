import * as dotenv from "dotenv";
dotenv.config({ quiet: true });

import { request as apiRequest, APIRequestContext } from "@playwright/test";
import type { APIResponse } from "@playwright/test";

export async function createApiClient(request: APIRequestContext) {
  return await apiRequest.newContext({
    extraHTTPHeaders: {
      accept: "application/fhir+json",
      "Content-Type": "application/fhir+json",
    },
  });
}

export async function getWithRetry(
  api: APIRequestContext,
  url: string,
  retries = 3,
  delay = 300,
): Promise<{ json: any; response: APIResponse }> {
  for (let i = 0; i < retries; i++) {
    const response = await api.get(url);
    const text = await response.text();

    if (text.startsWith("<")) {
      if (i === retries - 1) {
        throw new Error("Server returned HTML instead of JSON:\n" + text);
      }
      await new Promise((r) => setTimeout(r, delay));
      continue;
    }

    return {
      json: JSON.parse(text),
      response,
    };
  }

  throw new Error("Unexpected: getWithRetry exited without returning");
}
