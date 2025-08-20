<script lang="ts">
  import { ArrowLeft01Icon } from "@hugeicons/core-free-icons";

  import { Icon } from "$lib/client/components/icons";

  let { children } = $props();
</script>

<main class="bg-base-200 min-h-screen w-full p-4">
  <a href="/" class="btn btn-square btn-neutral">
    <Icon icon={ArrowLeft01Icon} />
  </a>

  {@render children()}
</main>
