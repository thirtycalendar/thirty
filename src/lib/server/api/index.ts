import { Hono } from "hono";
import { cors } from "hono/cors";
import { HTTPException } from "hono/http-exception";

import type { ErrorResponse } from "$lib/types";
import { isProd } from "$lib/utils/is-prod";

import type { Context } from "./context";
import auth from "./routes/auth";
import calendar from "./routes/google/calendar";
import color from "./routes/google/color";
import event from "./routes/google/event";
import task from "./routes/google/task";

const app = new Hono<Context>().basePath("/api");

app.use("*", cors());

const routes = app
  .route("/auth", auth)
  .route("/google/color", color)
  .route("/google/calendar", calendar)
  .route("/google/event", event)
  .route("/google/task", task);

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
      message: isProd ? "Internal Server Error" : (err.stack ?? err.message)
    },
    500
  );
});

export type AppType = typeof routes;

export default app;
