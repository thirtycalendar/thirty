import { PUBLIC_API } from "$env/static/public";
import { createAuthClient } from "better-auth/svelte";

export const authClient = createAuthClient({ baseURL: `${PUBLIC_API}/auth` });
