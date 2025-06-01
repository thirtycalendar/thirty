import {
  GOOGLE_CLIENT_ID_DEV,
  GOOGLE_CLIENT_ID_PROD,
  GOOGLE_CLIENT_SECRET_DEV,
  GOOGLE_CLIENT_SECRET_PROD
} from "$env/static/private";

import { googleScopes } from "$lib/server/auth/scopes";

import { isProd } from "./is-prod";

export const googleEnvConfig = {
  clientId: isProd ? GOOGLE_CLIENT_ID_PROD : GOOGLE_CLIENT_ID_DEV,
  clientSecret: isProd ? GOOGLE_CLIENT_SECRET_PROD : GOOGLE_CLIENT_SECRET_DEV,
  scopes: googleScopes
};
