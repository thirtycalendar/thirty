import { browser } from "$app/environment";

import posthog from "posthog-js";

import { isProd } from "../lib/shared/utils/is-prod";

export const load = async () => {
  if (isProd && browser) {
    posthog.init("phc_T3fkcvBt6kNq4Xfew2uWlrgO0UMwPj54GFASDlgTeO2", {
      api_host: "https://eu.i.posthog.com",
      defaults: "2025-05-24",
      person_profiles: "always"
    });

    posthog.capture("my event", { property: "value" });
  }

  return;
};
