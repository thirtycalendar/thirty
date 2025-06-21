import { requireAuth } from "$lib/server/auth/auth-helpers";

import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ request }) => {
  await requireAuth(request);

  const seo = {
    title: "Appearance",
    url: "https://calen.chat/appearance",
    description: "Automate your calendar with AI — just type what you need, and it's done.",
    image: "https://hqqk5u623c.ufs.sh/f/iKaDWWmT042q17NthmSV2O87Dfkbp9I0KZuQP5exwUAgMGsJ",
    twitterHandle: "@sithucodes"
  };

  return { seo };
};
