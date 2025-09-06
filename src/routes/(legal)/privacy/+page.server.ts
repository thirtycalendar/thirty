import { seoConfig } from "$lib/shared/config";

import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = () => {
  const seo = {
    title: seoConfig.title("Privacy Policy"),
    url: seoConfig.url("privacy"),
    description: seoConfig.description,
    image: seoConfig.image,
    twitterHandle: seoConfig.twitterHandle
  };

  return { seo };
};
