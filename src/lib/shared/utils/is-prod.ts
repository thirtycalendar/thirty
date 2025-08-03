import { PUBLIC_IS_PROD } from "$env/static/public";

export const isProd = PUBLIC_IS_PROD === "true";
