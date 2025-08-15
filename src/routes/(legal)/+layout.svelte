<script lang="ts">
  import { Navbar } from "$lib/client/components/home";

  let { children } = $props();
</script>

<main class="min-h-screen w-full">
  <Navbar />

  {@render children()}
</main>
