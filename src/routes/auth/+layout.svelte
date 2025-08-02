<script lang="ts">
  import { ArrowLeft } from "@lucide/svelte";

  let { children } = $props();
</script>

<main class="bg-base-200 min-h-screen w-full p-4">
  <nav class="m-2 flex items-center justify-between">
    <a href="/" class="flex items-center">
      <ArrowLeft size={15} /> <span class="px-2 text-sm">Back</span>
    </a>
  </nav>

  {@render children()}
</main>
