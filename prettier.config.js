/** @type {import('prettier').Config} */
module.exports = {
  importOrder: [
    "^(svelte/(.*)$)|^(svelte$)",
    "^(@sveltejs/(.*)$)|^(@sveltejs$)",
    "^(lucide-svelte/(.*)$)|^(lucide-svelte$)",
    "",
    "^(@zod/(.*)$)|^(@zod$)",
    "^(hono/(.*)$)|^(hono$)",
    "^(drizzle-orm/(.*)$)|^(drizzle-orm$)",
    "^(@better-auth/(.*)$)|^(@better-auth$)",
    "^(@resend/(.*)$)|^(@resend$)",
    "<THIRD_PARTY_MODULES>",
    "",
    "^$lib/features/(.*)$",
    "^$lib/components/(.*)$",
    "^$lib/server/(.*)$",
    "^$lib/state/(.*)$",
    "^$lib/assets/(.*)$",
    "^$lib/utils/(.*)$",
    "^$lib/(.*)$",
    "",
    "^[./]"
  ],
  importOrderParserPlugins: ["typescript", "svelte", "decorators-legacy"],
  plugins: ["@ianvs/prettier-plugin-sort-imports"]
};
