import { redirectIfAuthenticated } from "$lib/server/auth/auth-helpers";

import { seoConfig } from "$lib/shared/config";

import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ request }) => {
  await redirectIfAuthenticated(request);

  const seo = {
    title: seoConfig.title("Auth"),
    url: seoConfig.url("auth"),
    description: seoConfig.description,
    image: seoConfig.image,
    twitterHandle: seoConfig.twitterHandle
  };

  return { seo };
};
