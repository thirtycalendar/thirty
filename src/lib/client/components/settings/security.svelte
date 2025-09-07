<script lang="ts">
  import { Logout05Icon } from "@hugeicons/core-free-icons";

  import { createLogout } from "$lib/client/data/mutations";
  import { session } from "$lib/client/stores/user-session";

  import { Icon } from "../icons";

  const { mutate: handleLogout, isPending } = createLogout();
</script>

<div class="text-primary-content/80 space-y-3">
  {#if $session}
    <div class="bg-base-200 border-rounded mb-2 flex gap-2 p-2">
      <img
        src={$session.image}
        referrerpolicy="no-referrer"
        alt=""
        class="border-base-300 w-12 rounded-full border-2"
      />

      <div class="flex w-full items-center justify-between">
        <div>
          <p>{$session.name}</p>
          <p class="text-sm">{$session.email}</p>
        </div>

        <button
          class="btn btn-ghost btn-square tooltip"
          data-tip="Logout"
          onclick={() => {
            handleLogout();
          }}
          disabled={$isPending}
        >
          <Icon icon={Logout05Icon} size={17} absoluteStrokeWidth />
        </button>
      </div>
    </div>
  {/if}
</div>
