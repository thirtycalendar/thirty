<script lang="ts">
  import { InputField } from "$lib/client/components";
  import { toggleModal } from "$lib/client/components/utils";
  import { hdCountryAddModalId } from "$lib/client/stores/holiday";
  import { showToast } from "$lib/client/stores/toast";
  import { createForm } from "$lib/client/utils/create-form";
  import { createMutation } from "$lib/client/utils/query/create-mutation";
  import { client } from "$lib/client/utils/rpc";

  import { holidaySchema } from "$lib/shared/schemas/holiday";
  import type { HolidayCountryForm } from "$lib/shared/types";

  let errorMessage = $state("");

  let { mutate, isPending } = createMutation({
    mutationFn: async (formData: HolidayCountryForm) => {
      const res = await client.api.holiday.country.add.$post({ json: formData });
      const data = await res.json();

      if (!data.success) throw new Error(data.message);

      return data;
    },
    onMutate: () => {
      errorMessage = "";
    },
    onSuccess: (data) => {
      errorMessage = "";

      showToast(data.message);
      toggleModal(hdCountryAddModalId);
    },
    onError: (message: Error["message"]) => {
      errorMessage = message;
    },
    queryKeys: ["hd-list", "hd-country-list", "all-hd-country-list"]
  });

  async function onSubmit(data: HolidayCountryForm) {
    await mutate(data);
  }

  const defaultValues: HolidayCountryForm = {
    id: "",
    colorId: "",
    countryName: "",
    countryCode: ""
  };

  const { formData, formErrors, isSubmitting, handleInput, handleSubmit } = createForm({
    schema: holidaySchema,
    defaultValues,
    onSubmit
  });
</script>

<form onsubmit={handleSubmit()} class="space-y-2">
  {#if errorMessage !== ""}
    <p class="text-sm text-error mt-1">{errorMessage}</p>
  {/if}

  <InputField name="countryCode" placeholder="Add title" {handleInput} {formData} {formErrors} />

  <div class="flex justify-end gap-2">
    <button type="submit" class="btn btn-base-300 font-bold" disabled={$isSubmitting || $isPending}>
      Save
    </button>
  </div>
</form>
