<script lang="ts">
  import { AlertCircleIcon } from "@hugeicons/core-free-icons";

  import { removeToast, toasts } from "../stores/toast";
  import { Icon } from "./icons";
</script>

<div class="toast toast-top toast-center z-5000">
  {#each $toasts as toast (toast.id)}
    <button
      class="alert z-4000 {toast.isError ? 'alert-error' : 'bg-base-300'}"
      onclick={() => removeToast(toast.id)}
    >
      <Icon icon={AlertCircleIcon} size={17} absoluteStrokeWidth />
      <span>{toast.message}</span>
    </button>
  {/each}
</div>
