<script lang="ts">
  import { goto } from "$app/navigation";
</script>

<div class="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2">
  <button class="btn" onclick={() => goto("/auth")}> Auth </button>
</div>
