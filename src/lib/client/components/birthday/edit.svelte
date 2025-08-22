<script lang="ts">
  import { birthdayModalStore } from "$lib/client/stores/modal";
  import { showToast } from "$lib/client/stores/toast";
  import { createMutation } from "$lib/client/utils/query/create-mutation";
  import { client } from "$lib/client/utils/rpc";

  import type { Birthday, BirthdayForm } from "$lib/shared/types";

  import { Form } from ".";

  interface Props {
    birthday: Birthday;
  }

  let { birthday }: Props = $props();

  let errorMessage = $state("");

  const defaultValues: BirthdayForm = {
    name: birthday.name,
    dob: birthday.dob,
    color: birthday.color,
    note: birthday.note
  };

  let { mutate, isPending } = createMutation({
    mutationFn: async (formData: BirthdayForm) => {
      const res = await client.api.birthday.update[":id"].$put({
        param: { id: birthday.id },
        json: formData
      });
      const data = await res.json();

      if (!data.success) throw new Error(data.message);

      return data;
    },
    onMutate: () => {
      errorMessage = "";
    },
    onSuccess: (data) => {
      errorMessage = "";
      birthdayModalStore.activeItem.set(data.data);

      showToast(data.message);
      birthdayModalStore.stopEditing();
    },
    onError: (message: Error["message"]) => {
      errorMessage = message;
    },
    queryKeys: ["birthdays"]
  });

  async function onSubmit(data: BirthdayForm) {
    await mutate(data);
  }
</script>

<Form {defaultValues} {onSubmit} isMutationPending={$isPending} bind:errorMessage />
