import { Hono } from "hono";
import { cors } from "hono/cors";
import { handle } from "hono/vercel";

import { auth } from "../libs/auth";
import { Context } from "./context";

export const config = {
  runtime: "edge",
};

const app = new Hono<Context>().basePath("/api");

app.use("*", cors());

app.on(["POST", "GET"], "/auth/**", (c) => auth.handler(c.req.raw));

app.get("/", (c) => {
  return c.json({ message: "Hello Hono!" });
});

export default handle(app);
