<script lang="ts">
  import { birthdayModal } from "$lib/client/stores/modal";
  import { showToast } from "$lib/client/stores/toast";
  import { createMutation } from "$lib/client/utils/query/create-mutation";
  import { client } from "$lib/client/utils/rpc";

  import type { Birthday, BirthdayForm as BirthdayFormType } from "$lib/shared/types";

  import { BdForm } from ".";

  interface Props {
    birthday: Birthday;
  }

  let { birthday }: Props = $props();

  let errorMessage = $state("");

  const defaultValues: BirthdayFormType = {
    name: birthday.name,
    dob: birthday.dob,
    color: birthday.color,
    note: birthday.note
  };

  let { mutate, isPending } = createMutation({
    mutationFn: async (formData: BirthdayFormType) => {
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
      birthdayModal.currentDetails.set(data.data);

      showToast(data.message);
      birthdayModal.stopEditing();
    },
    onError: (message: Error["message"]) => {
      errorMessage = message;
    },
    queryKeys: ["bd-list"]
  });

  async function onSubmit(data: BirthdayFormType) {
    await mutate(data);
  }
</script>

<BdForm {defaultValues} {onSubmit} isMutationPending={$isPending} bind:errorMessage />
