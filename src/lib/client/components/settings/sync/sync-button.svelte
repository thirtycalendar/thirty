<script lang="ts">
  import type { Snippet } from "svelte";

  interface Props {
    provider: string;
    successMessage: string;
    errorMessage: string;
    isPending: boolean;
    handleReauth?: () => void;
    handleSync: () => void;
    children: Snippet;
  }

  const {
    provider,
    successMessage,
    errorMessage,
    isPending,
    handleReauth,
    handleSync,
    children
  }: Props = $props();
</script>

{#if successMessage}
  <p class="text-success my-3 w-full text-sm">{successMessage}</p>
{/if}

{#if errorMessage}
  <div class="my-3 space-y-2">
    <p class="text-error w-full text-sm">{errorMessage}</p>

    {#if handleReauth}
      <button class="text-error cursor-pointer text-sm italic underline" onclick={handleReauth}>
        Reauthenticate
      </button>
    {/if}
  </div>
{/if}

<p class="text-primary-content/80 mb-2 font-medium">{provider}</p>

<button class="btn btn-accent w-full font-normal" onclick={handleSync} disabled={isPending}>
  {#if isPending}
    <span class="loading loading-spinner loading-xs"></span>
  {/if}

  {@render children()}
</button>
