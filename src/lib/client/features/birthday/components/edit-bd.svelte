<script lang="ts">
  import { currentBirthdayDetails, handleBirthdayStopEditing } from "$lib/client/stores/birthday";
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
  let isErrorMessage = $derived(errorMessage !== "");

  const defaultValues: BirthdayFormType = {
    name: birthday.name,
    dob: birthday.dob,
    colorId: birthday.colorId,
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
      currentBirthdayDetails.set(data.data);

      showToast(data.message);
      handleBirthdayStopEditing();
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

{#if isErrorMessage}
  <p class="text-sm text-error my-1">{errorMessage}</p>
{/if}

<BdForm {defaultValues} {onSubmit} isMutationPending={$isPending} />
