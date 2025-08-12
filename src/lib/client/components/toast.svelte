<script lang="ts">
  import { Info } from "@lucide/svelte";

  import { removeToast, toasts } from "../stores/toast";
</script>

<div class="toast toast-top toast-center z-5000">
  {#each $toasts as toast (toast.id)}
    <button
      class="alert z-4000 {toast.isError ? 'alert-error' : 'bg-base-300'}"
      onclick={() => removeToast(toast.id)}
    >
      <Info size={18} />
      <span>{toast.message}</span>
    </button>
  {/each}
</div>
