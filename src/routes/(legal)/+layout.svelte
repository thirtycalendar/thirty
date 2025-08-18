<script lang="ts">
  import { Navbar } from "$lib/client/components/home";

  let { children } = $props();
</script>

<Navbar />

<div class="m-auto mt-15 max-w-4xl">
  {@render children()}
</div>
