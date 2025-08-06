<script lang="ts">
  import { ArrowLeft } from "@lucide/svelte";

  let { children } = $props();
</script>

<main class="mx-auto max-w-[800px] p-10">
  <a href="/" class="btn btn-sm mb-5">
    <ArrowLeft size={15} /> Back
  </a>
  {@render children()}
</main>
