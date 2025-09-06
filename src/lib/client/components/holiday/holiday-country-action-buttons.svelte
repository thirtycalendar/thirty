<script lang="ts">
  import { DetailActionButtons } from "$lib/client/components";
  import { toggleDraggableModal } from "$lib/client/components/utils";
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
    mutationFn: async () => {
      const res = await client.api.holiday.country.remove[":id"].$delete({ param: { id } });
      const data = await res.json();

      if (!data.success) throw new Error(data.message);

      return data;
    },
    onMutate: () => {
      errorMessage = "";
    },
    onSuccess: (data) => {
      confirmDelete = false;

      toggleDraggableModal(id);
      showToast(data.message);
    },
    onError: (message: Error["message"]) => {
      confirmDelete = false;
      errorMessage = message;
    },
    queryKeys: ["holidays", "holiday-countries", "all-holiday-countries"]
  });

  function handleDelete() {
    mutate();
  }
</script>

<DetailActionButtons
  {id}
  bind:confirmDelete
  isPending={$isPending}
  onDelete={handleDelete}
  showEdit={false}
/>
