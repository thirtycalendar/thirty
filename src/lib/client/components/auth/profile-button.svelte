<script lang="ts">
  import { session } from "$lib/client/stores/user-session";
</script>

{#if $session}
  <button class="btn btn-circle">
    <img
      class="border-base-300 w-8 rounded-full border-2"
      src={$session.image}
      referrerpolicy="no-referrer"
      alt="Img"
    />
  </button>
{/if}
