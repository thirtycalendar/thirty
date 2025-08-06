import { requireAuth } from "$lib/server/auth/auth-helpers";

import { seoConfig } from "$lib/shared/config";

import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ request }) => {
  await requireAuth(request);

  const seo = {
    title: seoConfig.title("Apperance"),
    url: seoConfig.url("settings/apperance"),
    description: seoConfig.description,
    image: seoConfig.image,
    twitterHandle: seoConfig.twitterHandle
  };

  return { seo };
};
