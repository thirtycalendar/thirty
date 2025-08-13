<script lang="ts">
  import { removeToast, toasts } from "../stores/toast";
  import { Info } from "./icons";
</script>

<div class="toast toast-top toast-center z-5000">
  {#each $toasts as toast (toast.id)}
    <button
      class="alert z-4000 {toast.isError ? 'alert-error' : 'bg-base-300'}"
      onclick={() => removeToast(toast.id)}
    >
      <Info size="18" />
      <span>{toast.message}</span>
    </button>
  {/each}
</div>
