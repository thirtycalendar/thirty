import { NODE_ENV } from "$env/static/private";
import { PUBLIC_BASE_URL } from "$env/static/public";

import { Hono } from "hono";
import { cors } from "hono/cors";
import { HTTPException } from "hono/http-exception";

import type { ErrorResponse } from "$lib/shared/types";

import type { Context } from "./context";
import {
  authRoute,
  birthdayRoute,
  calendarRoute,
  chatRoute,
  eventRoute,
  holidayRoute,
  syncRoute,
  taskRoute,
  userRoute,
  waitingListRoute
} from "./routes";

const app = new Hono<Context>().basePath("/api");

app.use("*", cors({ origin: PUBLIC_BASE_URL }));

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const routes = app
  .route("/auth", authRoute)
  .route("/user", userRoute)
  .route("/chat", chatRoute)
  .route("/calendar", calendarRoute)
  .route("/event", eventRoute)
  .route("/task", taskRoute)
  .route("/birthday", birthdayRoute)
  .route("/holiday", holidayRoute)
  .route("/sync", syncRoute)
  .route("/waitingList", waitingListRoute);

// External routes
// app.route("/calendarific", calendarificRoute);

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
