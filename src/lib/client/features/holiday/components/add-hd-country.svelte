<script lang="ts">
  import { toggleModal } from "$lib/client/components/utils";
  import { hdCountryAddModalId } from "$lib/client/stores/holiday";
  import { showToast } from "$lib/client/stores/toast";
  import { createForm } from "$lib/client/utils/create-form";
  import { createMutation } from "$lib/client/utils/query/create-mutation";
  import { client } from "$lib/client/utils/rpc";

  import { holidaySchema } from "$lib/shared/schemas/holiday";
  import type { HolidayCountryForm } from "$lib/shared/types";

  import { getAllHolidayCountries } from "../query";

  import { HdCountryField } from ".";

  let errorMessage = $state("");

  const { data: holidayCountries } = getAllHolidayCountries();

  const defaultValues: HolidayCountryForm = {
    id: "",
    colorId: "",
    countryName: "",
    countryCode: ""
  };

  const { formData, formErrors, isSubmitting, handleSubmit } = createForm({
    schema: holidaySchema,
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

  let prevId = $state($formData.id);

  $effect(() => {
    if ($formData.id && $formData.id !== prevId && $holidayCountries) {
      console.log("Got run..");
      const match = $holidayCountries.find((c) => c.id === $formData.id);
      if (match) {
        console.log("match", match);

        formData.set({
          id: match.id,
          colorId: match.colorId,
          countryName: match.countryName,
          countryCode: match.countryCode
        });
      }

      prevId = $formData.id;
    }
  });
</script>

{#if $holidayCountries}
  <form onsubmit={handleSubmit()} class="space-y-2 my-2">
    {#if errorMessage}
      <p class="text-sm text-error mt-1">{errorMessage}</p>
    {/if}

    <HdCountryField name="id" {formData} {formErrors} holidayCountries={$holidayCountries} />

    <div class="flex justify-end gap-2">
      <button
        type="submit"
        class="btn btn-base-300 font-bold"
        disabled={$isSubmitting || $isPending}
      >
        Save
      </button>
    </div>
  </form>
{/if}
