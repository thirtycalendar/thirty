<script lang="ts">
  import { format } from "date-fns";

  import { toggleModal } from "$lib/client/components/utils";
  import { birthdayModal } from "$lib/client/stores/modal";
  import { showToast } from "$lib/client/stores/toast";
  import { createMutation } from "$lib/client/utils/query/create-mutation";
  import { client } from "$lib/client/utils/rpc";

  import { getRandomColor } from "$lib/shared/utils/colors";
  import type { BirthdayForm as BirthdayFormType } from "$lib/shared/types";

  import { BdForm } from ".";

  let errorMessage = $state("");

  const defaultValues: BirthdayFormType = {
    name: "",
    dob: format(new Date(), "yyyy-MM-dd"),
    color: getRandomColor(),
    note: null
  };

  let { mutate, isPending } = createMutation({
    mutationFn: async (formData: BirthdayFormType) => {
      const res = await client.api.birthday.create.$post({ json: formData });
      const data = await res.json();

      if (!data.success) throw new Error(data.message);

      return data;
    },
    onMutate: () => {
      errorMessage = "";
    },
    onSuccess: (data) => {
      errorMessage = "";
      defaultValues.color = getRandomColor();

      showToast(data.message);
      toggleModal(birthdayModal.modalId);
    },
    onError: (message: Error["message"]) => {
      errorMessage = message;
    },
    queryKeys: ["birthdays"]
  });

  async function onSubmit(data: BirthdayFormType) {
    await mutate(data);
  }
</script>

<BdForm {defaultValues} {onSubmit} isMutationPending={$isPending} bind:errorMessage isCreate />
