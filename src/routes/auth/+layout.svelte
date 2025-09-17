<script lang="ts">
  import { onMount } from "svelte";

  import { ArrowLeft01Icon } from "@hugeicons/core-free-icons";

  import { Icon } from "$lib/client/components/icons";
  import { mainSidebarStore } from "$lib/client/stores/boolean-store";

  let { children } = $props();

  onMount(() => {
    if (window.innerWidth <= 640) {
      mainSidebarStore.set(false);
    }
  });
</script>

<main class="bg-base-200 min-h-screen w-full p-4">
  <a href="/" class="btn btn-square btn-neutral">
    <Icon icon={ArrowLeft01Icon} />
  </a>

  {@render children()}
</main>
