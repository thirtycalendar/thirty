import { requireAuth } from "$lib/server/auth/auth-helpers";

import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ request }) => {
  await requireAuth(request);

  const seo = {
    title: "Calendar",
    description:
      "Take control of your subscriptions. Track, manage, and streamline your subscriptions, never get overcharged again.",
    url: "https://getrecurrify.com/table",
    image: "https://hqqk5u623c.ufs.sh/f/iKaDWWmT042q17NthmSV2O87Dfkbp9I0KZuQP5exwUAgMGsJ",
    twitterHandle: "@_ht_sk"
  };

  return { seo };
};
