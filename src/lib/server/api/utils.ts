import type { Context } from "hono";
import type { ContentfulStatusCode } from "hono/utils/http-status";

import type { ErrorResponse } from "$lib/types";

export function requireParamId(c: Context, name: string): Response {
  return c.json<ErrorResponse>({ success: false, message: `Missing ${name} Id` }, 400);
}

export function errorResponse(c: Context, message: string, status: ContentfulStatusCode = 400) {
  console.error("error:", message);

  return c.json<ErrorResponse>(
    {
      success: false,
      message
    },
    status
  );
}
