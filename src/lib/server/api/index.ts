import { NODE_ENV } from "$env/static/private";

import { Hono } from "hono";
import { cors } from "hono/cors";
import { HTTPException } from "hono/http-exception";

import type { ErrorResponse } from "$lib/types";

import type { Context } from "./context";
import auth from "./routes/auth";
import calendar from "./routes/calendars/google/calendar";
import event from "./routes/calendars/google/event";

const app = new Hono<Context>().basePath("/api");

app.use("*", cors());

const routes = app
  .route("/auth", auth)
  .route("/calendars/google/calendar", calendar)
  .route("/calendars/google/event", event);

app.onError((err, c) => {
  if (err instanceof HTTPException) {
    const errResponse =
      err.res ??
      c.json<ErrorResponse>(
        {
          success: false,
          message: err.message,
          isFormError:
            err.cause && typeof err.cause === "object" && "form" in err.cause
              ? err.cause.form === true
              : false
        },
        err.status
      );

    return errResponse;
  }

  return c.json<ErrorResponse>(
    {
      success: false,
      message: NODE_ENV === "production" ? "Internal Server Error" : (err.stack ?? err.message)
    },
    500
  );
});

export type AppType = typeof routes;

export default app;
