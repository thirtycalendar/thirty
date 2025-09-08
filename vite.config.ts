import { sveltekit } from "@sveltejs/kit/vite";

import tailwindcss from "@tailwindcss/vite";

import { defineConfig } from "vite";
import devtoolsJson from "vite-plugin-devtools-json";

export default defineConfig({
  plugins: [tailwindcss(), sveltekit(), devtoolsJson()],
  ssr: {
    noExternal: ["@hugeicons/svelte", "@polar-sh/sdk", "@polar-sh/better-auth"]
  },
  optimizeDeps: {
    include: ["@hugeicons/core-free-icons", "standardwebhooks"],
    exclude: ["@polar-sh/sdk/webhooks.ts"]
  }
});
