import { seoConfig } from "$lib/shared/config";

import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = () => {
  const seo = {
    title: seoConfig.title("", true),
    url: seoConfig.url(""),
    description: seoConfig.description,
    favicon: seoConfig.favicon,
    image: seoConfig.image,
    twitterHandle: seoConfig.twitterHandle
  };

  return { seo };
};
