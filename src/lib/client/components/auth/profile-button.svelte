<script lang="ts">
  import { session } from "$lib/client/stores/user-session";
</script>

{#if $session}
  <div class="flex items-center gap-2">
    <button>
      <img
        class="border-accent w-8 rounded-full border-2"
        src={$session.image}
        referrerpolicy="no-referrer"
        alt="Img"
      />
    </button>
  </div>
{/if}
