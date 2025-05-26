import { createAuthClient } from "better-auth/svelte";
import { PUBLIC_API } from "$env/static/public";

export const authClient = createAuthClient({ baseURL: `${PUBLIC_API}/auth` });
