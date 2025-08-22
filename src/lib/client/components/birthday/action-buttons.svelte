<script lang="ts">
  import { birthdayModalStore } from "$lib/client/stores/modal";
  import { showToast } from "$lib/client/stores/toast";
  import { createMutation } from "$lib/client/utils/query/create-mutation";
  import { client } from "$lib/client/utils/rpc";

  import { toggleDraggableModal } from "../utils";

  import { DetailActionButtons } from "..";

  interface Props {
    id: string;
    errorMessage: string;
  }

  let { id, errorMessage = $bindable() }: Props = $props();

  let confirmDelete = $state(false);

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

      toggleDraggableModal(id);
      showToast(data.message);
    },
    onError: (message: Error["message"]) => {
      confirmDelete = false;
      errorMessage = message;
    },
    queryKeys: ["birthdays"]
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
  onEdit={birthdayModalStore.startEditing}
/>
