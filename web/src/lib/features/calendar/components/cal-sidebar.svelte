<script lang="ts">
  import { isSm } from "$lib/stores/responsive";

  import { CalViewButtons, MiniCalendar } from ".";
</script>

{#if !$isSm}
  <div class="block mb-2">
    <CalViewButtons />
  </div>
{/if}

<MiniCalendar />
