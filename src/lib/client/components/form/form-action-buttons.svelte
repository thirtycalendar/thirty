<script lang="ts">
  interface Props {
    isCreate: boolean;
    isDisabled: boolean;
    isSaving: boolean;
    onCancel: () => void;
  }

  let { isCreate = false, isDisabled = false, isSaving = false, onCancel }: Props = $props();
</script>

<div class="flex justify-end gap-2 pt-4">
  {#if !isCreate}
    <button type="button" class="btn btn-ghost font-bold" onclick={onCancel} disabled={isDisabled}>
      Cancel
    </button>
  {/if}
  <button type="submit" class="btn btn-base-300 font-bold" disabled={isDisabled}>
    {#if isSaving}
      <span class="loading loading-spinner loading-xs"></span>
    {/if}
    Save
  </button>
</div>
