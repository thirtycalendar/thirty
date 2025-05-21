import type { Handle } from "@sveltejs/kit";

export const handle: Handle = async ({ event, resolve }) => {
  if (event.url.pathname.startsWith("/.well-known/")) {
    return new Response("Not Found", { status: 404 });
  }

  return resolve(event);
};
