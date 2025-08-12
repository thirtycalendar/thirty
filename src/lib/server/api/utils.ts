import type { Context } from "hono";
import type { ContentfulStatusCode } from "hono/utils/http-status";

import type { ErrorResponse } from "$lib/shared/types";

export function requireParam(c: Context, name: string) {
  return c.json<ErrorResponse>({ success: false, message: `Missing ${name} param` }, 400);
}

export function errorResponse(
  c: Context,
  err: unknown,
  message?: string,
  status: ContentfulStatusCode = 400
) {
  const errMessage = message ?? (err instanceof Error ? err.message : "An error occurred");

  if (err instanceof Error) {
    console.error("error:", errMessage, "| stack:", err.stack);
  } else {
    console.error("error:", errMessage);
  }

  return c.json<ErrorResponse>(
    {
      success: false,
      message: errMessage
    },
    status
  );
}
