<script lang="ts">
  import { isSm } from "$lib/stores/responsive";

  import { CalViewButtons } from ".";
</script>

{#if !$isSm}
  <div class="block mb-2">
    <CalViewButtons />
  </div>
{/if}

Cal Sidebar
