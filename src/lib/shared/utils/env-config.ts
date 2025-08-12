import { env } from "$env/dynamic/public";

import { isProd } from "./is-prod";

export const polarProductIdsEnvConfig = {
  pro: isProd ? env.PUBLIC_PRO_PRODUCT_ID_PROD : env.PUBLIC_PRO_PRODUCT_ID_DEV
} as const;
