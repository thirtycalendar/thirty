<script lang="ts">
  import { authMutation } from "$lib/client/data/mutations";
  import { cn } from "$lib/client/utils/cn";

  import { Google } from "../icons";

  interface Props {
    class?: string;
    label?: string;
    showIcon?: boolean;
  }

  const { class: classCn, label = "Continue with Google", showIcon = true }: Props = $props();

  const { mutate: handleAuth, isSuccess, isPending } = authMutation();
</script>

<button class={cn("btn", classCn)} onclick={handleAuth} disabled={$isPending || $isSuccess}>
  {#if $isPending}
    <span class="loading loading-spinner loading-xs"></span>
    <span class="text-sm sm:text-base">{label}</span>
  {:else if $isSuccess}
    <span class="text-sm sm:text-base">Redirecting...</span>
  {:else}
    {#if showIcon}<Google />{/if}
    <span class="text-sm sm:text-base">{label}</span>
  {/if}
</button>
