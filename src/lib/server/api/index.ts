import { Hono } from "hono";
import { cors } from "hono/cors";
import { HTTPException } from "hono/http-exception";
import { handle } from "hono/vercel";

import { auth } from "../libs/auth";
import { FRONTEND_URL, NODE_ENV } from "../libs/env";
import type { ErrorResponse } from "../libs/types";
import type { Context } from "./context";
import authroize from "./routes/authorize";

export const config = {
  runtime: "edge"
};

const app = new Hono<Context>().basePath("/api");

app.use(
  "*",
  cors({
    origin: [FRONTEND_URL],
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["POST", "GET", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
    credentials: true
  })
);

app.on(["POST", "GET"], "/auth/**", (c) => auth.handler(c.req.raw));

app.route("/authorize", authroize);

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

export default handle(app);
