import { env } from "$env/dynamic/public";

// Polar
export const polarProductIdsEnvConfig = {
  pro: env.PUBLIC_POLAR_PRODUCT_ID_PRO
} as const;
