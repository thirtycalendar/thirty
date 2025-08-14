<script lang="ts">
  import { Delete02Icon, Pen01Icon } from "@hugeicons/core-free-icons";

  import { Icon } from "./icons";

  interface Props {
    id: string;
    confirmDelete: boolean;
    isPending: boolean;
    message?: string;
    onDelete: () => void;
    onEdit?: () => void;
    showEdit?: boolean;
  }

  let {
    id,
    confirmDelete = $bindable(false),
    isPending,
    onDelete,
    onEdit,
    message = "Are you sure?",
    showEdit = true
  }: Props = $props();

  function toggleConfirm() {
    confirmDelete = !confirmDelete;
  }

  let prevId = $state(id);
  $effect(() => {
    if (prevId !== id) {
      confirmDelete = false;

      prevId = id;
    }
  });
</script>

{#if confirmDelete}
  <p class={`text-error text-right text-xs ${showEdit ? "mr-10" : "mr-2"}`}>{message}</p>
{/if}

<div class="flex justify-end">
  {#if confirmDelete}
    <div>
      <button
        class="btn btn-sm btn-neutral mr-1 text-xs"
        onclick={toggleConfirm}
        disabled={isPending}
      >
        No
      </button>
      <button class="btn btn-sm btn-error mr-1 text-xs" onclick={onDelete} disabled={isPending}>
        {#if isPending}
          <span class="loading loading-spinner loading-xs"></span>
        {/if}
        Yes
      </button>
    </div>
  {:else}
    <button
      class="btn btn-sm btn-square btn-ghost hover:bg-error"
      onclick={toggleConfirm}
      disabled={isPending}
    >
      <Icon icon={Delete02Icon} size={17} absoluteStrokeWidth />
    </button>
  {/if}

  {#if showEdit}
    <button
      class="btn btn-sm btn-square btn-ghost"
      onclick={onEdit}
      disabled={isPending || confirmDelete}
    >
      <Icon icon={Pen01Icon} size={17} absoluteStrokeWidth />
    </button>
  {/if}
</div>
