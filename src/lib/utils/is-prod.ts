import { NODE_ENV } from "$env/static/private";

export const isProd = NODE_ENV === "production";
