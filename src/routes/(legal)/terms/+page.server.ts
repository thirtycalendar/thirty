import { seoConfig } from "$lib/shared/config";

import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = () => {
  const seo = {
    title: seoConfig.title("Terms of Service"),
    url: seoConfig.url("terms"),
    description: seoConfig.description,
    image: seoConfig.image,
    twitterHandle: seoConfig.twitterHandle
  };

  return { seo };
};
