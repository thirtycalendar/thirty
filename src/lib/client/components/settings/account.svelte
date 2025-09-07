<script lang="ts">
  import { logoutAllMutation, logoutMutation } from "$lib/client/data/mutations";
  import { session } from "$lib/client/stores/user-session";

  const { mutate: handleLogout, isPending: logoutIsPending } = logoutMutation();
  const { mutate: handleLogoutAll, isPending: logoutAllIsPending } = logoutAllMutation();
</script>

<div class="text-primary-content/80 mt-4 space-y-4">
  {#if $session}
    <div class="flex gap-2">
      <img
        src={$session.image}
        referrerpolicy="no-referrer"
        alt=""
        class="border-base-300 w-12 rounded-full border-2"
      />

      <div>
        <p>{$session.name}</p>
        <p class="text-sm">{$session.email}</p>
      </div>
    </div>
  {/if}

  <hr class="text-base-200" />

  <div class="flex items-center justify-between text-sm">
    <p>Log out of this device</p>

    <button
      class="btn btn-sm btn-outline font-normal"
      onclick={handleLogout}
      disabled={$logoutIsPending || $logoutAllIsPending}
    >
      Logout
    </button>
  </div>

  <hr class="text-base-200" />

  <div class="flex items-center justify-between text-sm">
    <p>Log out of all devices</p>

    <button
      class="btn btn-sm btn-error btn-outline font-normal"
      onclick={handleLogoutAll}
      disabled={$logoutIsPending || $logoutAllIsPending}
    >
      Logout all
    </button>
  </div>
</div>
