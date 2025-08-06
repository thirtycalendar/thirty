import { requireAuth } from "$lib/server/auth/auth-helpers";

import { seoConfig } from "$lib/shared/config";

import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ request }) => {
  await requireAuth(request);

  const seo = {
    title: seoConfig.title("Billing"),
    url: seoConfig.url("settings/billing"),
    description: seoConfig.description,
    image: seoConfig.image,
    twitterHandle: seoConfig.twitterHandle
  };
  return { seo };
};
