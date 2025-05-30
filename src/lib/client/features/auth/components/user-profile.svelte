<script lang="ts">
  import { session } from "$lib/client/stores/user-session";
</script>

{#if $session}
  <div class="mb-3 p-2 flex items-center gap-3 rounded-lg border border-base-200 bg-base-200/60">
    <div>
      <img
        class="rounded-lg w-10 border border-base-100"
        src={$session.image}
        referrerpolicy="no-referrer"
        alt="Img"
      />
    </div>

    <div>
      <p
        class="font-semibold truncate max-w-[150px] overflow-hidden text-ellipsis whitespace-nowrap"
      >
        {$session.name || "Null"}
      </p>
      <p class="text-xs truncate max-w-[150px] overflow-hidden text-ellipsis whitespace-nowrap">
        {$session.email || "Null"}
      </p>
    </div>
  </div>
{/if}
