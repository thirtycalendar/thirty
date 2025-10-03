import { command, getRequestEvent } from "$app/server";

export const googleAuth = command(async () => {
  const { locals } = getRequestEvent();

  await locals.auth.api.signInSocial({ body: { provider: "google", callbackURL: "/calendar" } });
});
