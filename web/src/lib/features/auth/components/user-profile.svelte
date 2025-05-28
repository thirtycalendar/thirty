<script lang="ts">
  import { authClient } from "$lib/utils/rpc";

  const session = authClient.useSession();
</script>

{#if $session.data}
  <div class="mb-3 p-2 flex items-center gap-3 rounded-lg border border-base-200 bg-base-200/60">
    <div>
      <img
        class="rounded-lg w-10 border border-base-100"
        src={$session?.data?.user?.image}
        referrerpolicy="no-referrer"
        alt="Img"
      />
    </div>

    <div>
      <p
        class="font-semibold truncate max-w-[150px] overflow-hidden text-ellipsis whitespace-nowrap"
      >
        {$session?.data?.user?.name || "Null"}
      </p>
      <p class="text-xs truncate max-w-[150px] overflow-hidden text-ellipsis whitespace-nowrap">
        {$session?.data?.user?.email || "Null"}
      </p>
    </div>
  </div>
{/if}
