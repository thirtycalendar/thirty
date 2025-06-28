<script lang="ts">
  import { Trash } from "@lucide/svelte";

  import { toggleModal } from "$lib/client/components/utils";
  import { showToast } from "$lib/client/stores/toast";
  import { createMutation } from "$lib/client/utils/query/create-mutation";
  import { client } from "$lib/client/utils/rpc";

  interface DeleteEventButtonProps {
    id: string;
  }

  let { id }: DeleteEventButtonProps = $props();

  let confirmDelete = $state(false);

  function onclick() {
    confirmDelete = !confirmDelete;
  }

  let { mutate, isPending } = createMutation({
    mutationFn: async (id: string) => {
      const res = await client.api.event.delete[":id"].$delete({ param: { id } });
      const data = await res.json();

      if (!data.success) throw new Error(data.message);

      return data;
    },
    onSuccess: async (data) => {
      toggleModal(id);
      showToast(data.message);
    },
    onError: (message: Error["message"]) => {
      showToast(message, true);
    },
    queryKeys: ["event-list"]
  });

  function handleDelete() {
    mutate(id);
  }
</script>

{#if confirmDelete}
  <div>
    <button class="btn btn-sm btn-neutral text-xs mr-1" {onclick} disabled={$isPending}>
      No
    </button>
    <button class="btn btn-sm btn-error text-xs mr-1" onclick={handleDelete} disabled={$isPending}>
      Yes
    </button>
  </div>
{:else}
  <button class="btn btn-sm btn-square btn-ghost hover:bg-error" {onclick}>
    <Trash size="17" />
  </button>
{/if}
