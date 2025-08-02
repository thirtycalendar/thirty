import { redirectIfAuthenticated } from "$lib/server/auth/auth-helpers";

import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ request }) => {
  await redirectIfAuthenticated(request);

  const seo = {
    title: "Auth | Thirty Calendar",
    url: "https://thirtycalendar.com/auth",
    description: "Your Calendar. Smarter, Open, and Always Listening.",
    image: "https://hqqk5u623c.ufs.sh/f/iKaDWWmT042q17NthmSV2O87Dfkbp9I0KZuQP5exwUAgMGsJ",
    twitterHandle: "@itsithu"
  };

  return { seo };
};
