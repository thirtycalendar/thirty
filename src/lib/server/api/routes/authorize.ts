import { Hono } from "hono";

import type { Session, User } from "better-auth/types";

import type { SuccessResponse } from "../../libs/types";
import type { Context } from "../context";
import { loggedIn } from "../middlewares/logged-in";

const app = new Hono<Context>().post("/current", loggedIn, async (c) => {
  const session = c.get("session") as Session;
  const user = c.get("user") as User;

  return c.json<SuccessResponse<{ session: Session; user: User }>>({
    success: true,
    message: "Success",
    data: { session, user }
  });
});

export default app;
