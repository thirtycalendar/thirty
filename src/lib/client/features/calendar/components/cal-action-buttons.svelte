<script lang="ts">
  import { DetailActionButtons } from "$lib/client/components";
  import { toggleModal } from "$lib/client/components/utils";
  import { calendarModal } from "$lib/client/stores/modal";
  import { showToast } from "$lib/client/stores/toast";
  import { createMutation } from "$lib/client/utils/query/create-mutation";
  import { client } from "$lib/client/utils/rpc";

  interface Props {
    id: string;
    errorMessage: string;
  }

  let { id, errorMessage = $bindable() }: Props = $props();

  let confirmDelete = $state(false);

  let { mutate, isPending } = createMutation({
    mutationFn: async (id: string) => {
      const res = await client.api.calendar.delete[":id"].$delete({ param: { id } });
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
      confirmDelete = false;
      errorMessage = message;
    },
    queryKeys: ["cal-list", "event-list"]
  });

  function handleDelete() {
    mutate(id);
  }
</script>

<DetailActionButtons
  {id}
  bind:confirmDelete
  isPending={$isPending}
  onDelete={handleDelete}
  onEdit={calendarModal.startEditing}
  message="Deleting this calendar will also delete its events. Sure?"
/>
