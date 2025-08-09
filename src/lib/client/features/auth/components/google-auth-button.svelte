<script lang="ts">
  import { onMount } from "svelte";

  import { GoogleIcon } from "$lib/client/components";
  import { isMd } from "$lib/client/stores/responsive";
  import { mainSidebarId } from "$lib/client/stores/sidebar";
  import { showToast } from "$lib/client/stores/toast";
  import { cn } from "$lib/client/utils/cn";
  import { createMutation } from "$lib/client/utils/query/create-mutation";
  import { authClient } from "$lib/client/utils/rpc";

  interface Props {
    class?: string;
    label?: string;
    showIcon?: boolean;
  }

  const { class: classCn, label = "Continue with Google", showIcon = true }: Props = $props();

  const { mutate, isSuccess, isPending } = createMutation({
    mutationFn: async () => {
      const data = await authClient.signIn.oauth2({
        providerId: "google",
        callbackURL: "/calendar"
      });

      if (data.error) {
        throw new Error(data.error.message);
      }
    },
    onError: (message: Error["message"]) => {
      showToast(message, true);

      isPending.set(false);
      isSuccess.set(false);
    }
  });

  function onclick() {
    mutate();
  }

  onMount(() => {
    if ($isMd) {
      localStorage.setItem(mainSidebarId, "true");
    }

    return () => {
      isPending.set(false);
      isSuccess.set(false);
    };
  });
</script>

<button class={cn("btn", classCn)} {onclick} disabled={$isPending || $isSuccess}>
  {#if $isPending}
    <span class="loading loading-spinner loading-xs"></span>
    <span class="text-sm sm:text-base">{label}</span>
  {:else if $isSuccess}
    <span class="text-sm sm:text-base">Redirecting...</span>
  {:else}
    {#if showIcon}<GoogleIcon />{/if}
    <span class="text-sm sm:text-base">{label}</span>
  {/if}
</button>
