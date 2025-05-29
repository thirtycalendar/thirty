<script lang="ts">
  import { ArrowLeft } from "@lucide/svelte";

  let { children } = $props();
</script>

<main class="bg-base-200 w-full min-h-screen p-4">
  <nav class="flex justify-between items-center m-2">
    <a href="/" class="flex items-center">
      <ArrowLeft size={15} /> <span class="px-2 text-sm">Back</span>
    </a>
  </nav>

  {@render children()}
</main>
