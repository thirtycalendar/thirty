import {
  GOOGLE_CLIENT_ID_DEV,
  GOOGLE_CLIENT_ID_PROD,
  GOOGLE_CLIENT_SECRET_DEV,
  GOOGLE_CLIENT_SECRET_PROD
} from "$env/static/private";

import { google } from "googleapis";

import { isProd } from "$lib/utils/is-prod";

export async function storeGoogleSessionToKV(userId: string) {
  const oAuthClient = new google.auth.OAuth2({
    clientId: isProd ? GOOGLE_CLIENT_ID_PROD : GOOGLE_CLIENT_ID_DEV,
    clientSecret: isProd ? GOOGLE_CLIENT_SECRET_PROD : GOOGLE_CLIENT_SECRET_DEV
  });
}
