<script lang="ts">
  import { ArrowLeft01Icon } from "@hugeicons/core-free-icons";

  import { Icon } from "$lib/client/components/icons";

  let { children } = $props();
</script>

<main class="bg-base-200 min-h-screen w-full p-4">
  <nav class="m-2 flex items-center justify-between">
    <a href="/" class="btn btn-square btn-secondary flex items-center">
      <Icon icon={ArrowLeft01Icon} />
    </a>
  </nav>

  {@render children()}
</main>
