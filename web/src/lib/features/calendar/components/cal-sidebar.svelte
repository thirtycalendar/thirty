<script lang="ts">
  import { isSm } from "$lib/stores/responsive";

  import { CalList, MiniCalendar } from ".";
</script>

<div class="max-h-screen overflow-y-scroll">
  <MiniCalendar />

  <CalList />
</div>
