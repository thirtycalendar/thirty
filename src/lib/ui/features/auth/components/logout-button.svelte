<script lang="ts">
  import { goto } from "$app/navigation";

  import { LogOut } from "@lucide/svelte";

  import { createMutation } from "$lib/utils/query/create-mutation";
  import { authClient } from "$lib/utils/rpc";

  async function handleLogout() {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          localStorage.removeItem("user_session");
          goto("/auth");
        }
      }
    });
  }

  let { isPending } = createMutation({ mutationFn: async () => await handleLogout() });
</script>

<div class="tooltip tooltip-bottom" data-tip="Logout">
  <button class="btn" onclick={handleLogout} disabled={$isPending}>
    <LogOut size="18" />

    <span class="hidden sm:flex">Logout</span>
  </button>
</div>
