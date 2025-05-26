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

  <div
    class="absolute top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
  >
    {@render children()}
  </div>
</main>
