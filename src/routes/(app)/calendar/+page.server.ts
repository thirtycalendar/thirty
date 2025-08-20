import { requireAuth } from "$lib/server/auth/auth-helpers";

import { seoConfig } from "$lib/shared/config";

import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ request }) => {
  await requireAuth(request);

  const seo = {
    title: seoConfig.title("Calendar"),
    url: seoConfig.url("calendar"),
    description: seoConfig.description,
    favicon: seoConfig.favicon,
    image: seoConfig.image,
    twitterHandle: seoConfig.twitterHandle
  };

  return { seo };
};
