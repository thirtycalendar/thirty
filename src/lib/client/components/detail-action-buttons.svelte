<script lang="ts">
  import { Pen, Trash } from "@lucide/svelte";

  interface Props {
    confirmDelete: boolean;
    isPending: boolean;
    message?: string;
    onDelete: () => void;
    onEdit?: () => void;
    showEdit?: boolean;
  }

  let {
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
</script>

{#if confirmDelete}
  <p class={`text-xs text-error text-right ${showEdit ? "mr-10" : "mr-2"}`}>{message}</p>
{/if}

<div class="flex justify-end">
  {#if confirmDelete}
    <div>
      <button
        class="btn btn-sm btn-neutral text-xs mr-1"
        onclick={toggleConfirm}
        disabled={isPending}
      >
        No
      </button>
      <button class="btn btn-sm btn-error text-xs mr-1" onclick={onDelete} disabled={isPending}>
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
      <Trash size="17" />
    </button>
  {/if}

  {#if showEdit}
    <button
      class="btn btn-sm btn-square btn-ghost"
      onclick={onEdit}
      disabled={isPending || confirmDelete}
    >
      <Pen size="17" />
    </button>
  {/if}
</div>
