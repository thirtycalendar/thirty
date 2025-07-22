<script lang="ts">
  import { onMount } from "svelte";

  import { GoogleIcon } from "$lib/client/components";
  import { isMd } from "$lib/client/stores/responsive";
  import { mainSidebarId } from "$lib/client/stores/sidebar";
  import { createMutation } from "$lib/client/utils/query/create-mutation";

  import { googleAuth } from "../api";

  const { mutate, isSuccess, isPending } = createMutation({
    mutationFn: async () => {
      await googleAuth();
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

<button class="btn btn-lg btn-soft w-full my-2 font-semibold" {onclick} disabled={$isPending}>
  {#if $isPending}
    <span class="loading loading-spinner loading-xs"></span>
    <span class="text-sm sm:text-base">Continue with Google</span>
  {:else if $isSuccess}
    <span class="text-sm sm:text-base">Redirecting...</span>
  {:else}
    <GoogleIcon />
    <span class="text-sm sm:text-base">Continue with Google</span>
  {/if}
</button>
