import { Hono } from "hono";
import { cors } from "hono/cors";
import { HTTPException } from "hono/http-exception";

import { isProd } from "$lib/shared/utils/is-prod";
import type { ErrorResponse } from "$lib/shared/types";

import type { Context } from "./context";
import auth from "./routes/auth";
import birthday from "./routes/birthday";
import calendar from "./routes/calendar";
import calendarific from "./routes/calendarific";
import chat from "./routes/chat";
import event from "./routes/event";
import holiday from "./routes/holiday";
import message from "./routes/message";
import sync from "./routes/sync";
import task from "./routes/task";

const app = new Hono<Context>().basePath("/api");

app.use("*", cors());

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const routes = app
  .route("/auth", auth)
  .route("/chat", chat)
  .route("/calendar", calendar)
  .route("/event", event)
  .route("/task", task)
  .route("/birthday", birthday)
  .route("/holiday", holiday)
  .route("/message", message)
  .route("/sync", sync);

// External routes
app.route("/calendarific", calendarific);

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
