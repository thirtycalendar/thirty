<script lang="ts">
  import { session } from "$lib/client/stores/user-session";
</script>

{#if $session}
  <div class="border-base-200 bg-base-200/60 mb-3 flex items-center gap-3 rounded-lg border p-2">
    <div>
      <img
        class="border-base-100 w-10 rounded-lg border"
        src={$session.image}
        referrerpolicy="no-referrer"
        alt="Img"
      />
    </div>

    <div>
      <p
        class="max-w-[150px] truncate overflow-hidden font-semibold text-ellipsis whitespace-nowrap"
      >
        {$session.name || "Null"}
      </p>
      <p class="max-w-[150px] truncate overflow-hidden text-xs text-ellipsis whitespace-nowrap">
        {$session.email || "Null"}
      </p>
    </div>
  </div>
{/if}
