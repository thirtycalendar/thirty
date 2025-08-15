<script lang="ts">
  import { Navbar } from "$lib/client/components/home";

  let { children } = $props();
</script>

<main class="min-h-screen w-full">
  <Navbar />

  <div class="m-auto max-w-4xl">
    {@render children()}
  </div>
</main>
