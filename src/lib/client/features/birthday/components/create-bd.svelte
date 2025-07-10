<script lang="ts">
  import { format } from "date-fns";

  import { toggleModal } from "$lib/client/components/utils";
  import { birthdayCreateModalId } from "$lib/client/stores/birthday";
  import { showToast } from "$lib/client/stores/toast";
  import { createMutation } from "$lib/client/utils/query/create-mutation";
  import { client } from "$lib/client/utils/rpc";

  import { getRandomColorId } from "$lib/shared/utils/colors";
  import type { BirthdayForm as BirthdayFormType } from "$lib/shared/types";

  import { BdForm } from ".";

  let errorMessage = $state("");

  const defaultValues: BirthdayFormType = {
    name: "",
    dob: format(new Date(), "yyyy-MM-dd"),
    colorId: getRandomColorId(),
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
      defaultValues.colorId = getRandomColorId();

      showToast(data.message);
      toggleModal(birthdayCreateModalId);
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

<BdForm {defaultValues} {onSubmit} isMutationPending={$isPending} bind:errorMessage isCreate />
