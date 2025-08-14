<script lang="ts">
  import { onMount } from "svelte";

  import { initUserSession } from "$lib/client/stores/user-session";

  let { children } = $props();

  onMount(async () => {
    await initUserSession();
  });
</script>

<div class="bg-base-200 w-full">
  {@render children?.()}
</div>
