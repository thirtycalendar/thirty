<script lang="ts">
  import { goto } from "$app/navigation";

  import { LogOut } from "@lucide/svelte";

  import { createQuery } from "$lib/utils/query/create-query";
  import { authClient } from "$lib/utils/rpc";

  async function handleLogout() {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          goto("/auth");
        }
      }
    });
  }

  let { isPending } = createQuery({ queryFn: async () => await handleLogout() });
</script>

<div class="tooltip tooltip-bottom" data-tip="Logout">
  <button class="btn" onclick={handleLogout} disabled={$isPending}>
    <LogOut size="18" />

    <span class="hidden sm:flex">Logout</span>
  </button>
</div>
