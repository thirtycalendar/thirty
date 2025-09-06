<script lang="ts">
  import { allHolidayCountriesQuery } from "$lib/client/data/queries";
  import { holidayCountryModalStore } from "$lib/client/stores/modal";
  import { showToast } from "$lib/client/stores/toast";
  import { createForm } from "$lib/client/utils/create-form";
  import { createMutation } from "$lib/client/utils/query/create-mutation";
  import { client } from "$lib/client/utils/rpc";

  import { hdCountrySchema } from "$lib/shared/schemas/holiday";
  import type { HolidayCountryForm } from "$lib/shared/types";

  import { toggleDraggableModal } from "../utils";

  import { HolidayCountryField } from ".";

  let errorMessage = $state("");

  const { data: holidayCountries } = allHolidayCountriesQuery();

  const defaultValues: HolidayCountryForm = {
    id: ""
  };

  const { formData, formErrors, isSubmitting, handleSubmit } = createForm({
    schema: hdCountrySchema,
    defaultValues,
    onSubmit
  });

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
      toggleDraggableModal(holidayCountryModalStore.modalId);
    },
    onError: (message: Error["message"]) => {
      errorMessage = message;
    },
    queryKeys: ["holidays", "holiday-countries", "all-holiday-countries"]
  });

  async function onSubmit(data: HolidayCountryForm) {
    await mutate(data);
  }
</script>

{#if $holidayCountries}
  <form onsubmit={handleSubmit()} class="form-section my-2">
    {#if errorMessage}
      <p class="error-text">{errorMessage}</p>
    {/if}

    <HolidayCountryField name="id" {formData} {formErrors} holidayCountries={$holidayCountries} />

    <div class="flex justify-end gap-2">
      <button
        type="submit"
        class="btn btn-base-300 font-bold"
        disabled={$isSubmitting || $isPending}
      >
        {#if $isSubmitting || $isPending}
          <span class="loading loading-spinner loading-xs"></span>
        {/if}

        Save
      </button>
    </div>
  </form>
{/if}
