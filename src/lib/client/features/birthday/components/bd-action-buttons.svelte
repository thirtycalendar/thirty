<script lang="ts">
  import { onDestroy } from "svelte";

  import { Pen, Trash } from "@lucide/svelte";

  import { toggleModal } from "$lib/client/components/utils";
  import { handleBirthdayStartEditing } from "$lib/client/stores/birthday";
  import { showToast } from "$lib/client/stores/toast";
  import { createMutation } from "$lib/client/utils/query/create-mutation";
  import { client } from "$lib/client/utils/rpc";

  interface Props {
    id: string;
    errorMessage: string;
  }

  let { id, errorMessage = $bindable() }: Props = $props();

  let confirmDelete = $state(false);

  function onclick() {
    confirmDelete = !confirmDelete;
  }

  let { mutate, isPending } = createMutation({
    mutationFn: async (id: string) => {
      const res = await client.api.birthday.delete[":id"].$delete({ param: { id } });
      const data = await res.json();

      if (!data.success) throw new Error(data.message);

      return data;
    },
    onMutate: () => {
      errorMessage = "";
    },
    onSuccess: (data) => {
      confirmDelete = false;

      toggleModal(id);
      showToast(data.message);
    },
    onError: (message: Error["message"]) => {
      errorMessage = message;
    },
    queryKeys: ["bd-list"]
  });

  function handleDelete() {
    mutate(id);
  }

  onDestroy(() => {
    confirmDelete = false;
  });
</script>

{#if confirmDelete}
  <p class="text-xs text-error text-right mr-10">Are you sure?</p>
{/if}

<div class="flex justify-end">
  {#if confirmDelete}
    <div>
      <button class="btn btn-sm btn-neutral text-xs mr-1" {onclick} disabled={$isPending}>
        No
      </button>

      <button
        class="btn btn-sm btn-error text-xs mr-1"
        onclick={handleDelete}
        disabled={$isPending}
      >
        Yes
      </button>
    </div>
  {:else}
    <button class="btn btn-sm btn-square btn-ghost hover:bg-error" {onclick} disabled={$isPending}>
      <Trash size="17" />
    </button>
  {/if}

  <button
    class="btn btn-sm btn-square btn-ghost"
    onclick={handleBirthdayStartEditing}
    disabled={$isPending || confirmDelete}
  >
    <Pen size="17" />
  </button>
</div>
