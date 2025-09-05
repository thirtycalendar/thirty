<script lang="ts">
  import { AlertCircleIcon } from "@hugeicons/core-free-icons";

  import { removeToast, toasts } from "../stores/toast";
  import { cn } from "../utils/cn";
  import { Icon } from "./icons";
</script>

<div class="toast toast-top toast-center z-5000">
  {#each $toasts as toast (toast.id)}
    <button
      class={cn(
        "alert border-base-300 z-4000 border",
        toast.isError ? "alert-error" : "bg-base-200"
      )}
      onclick={() => removeToast(toast.id)}
    >
      <Icon icon={AlertCircleIcon} size={17} absoluteStrokeWidth />
      <span>{toast.message}</span>
    </button>
  {/each}
</div>
