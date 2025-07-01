<script lang="ts">
  import { ColorChoiceField, InputField } from "$lib/client/components";
  import { handleCalendarStopEditing } from "$lib/client/stores/calendar";
  import { createForm } from "$lib/client/utils/create-form";

  import type { CalendarForm } from "$lib/types";

  import { calendarSchema } from "../schema";

  interface CalFormProps {
    defaultValues: CalendarForm;
    onSubmit: (data: CalendarForm) => Promise<void>;
    isMutationPending: boolean;
    isCreate?: boolean;
  }

  let { defaultValues, onSubmit, isMutationPending, isCreate }: CalFormProps = $props();

  const { formData, formErrors, isSubmitting, handleInput, handleSubmit } = createForm({
    schema: calendarSchema,
    defaultValues
  });
</script>

<form onsubmit={handleSubmit((data) => onSubmit(data as CalendarForm))} class="space-y-2">
  <div class="flex items-start gap-3">
    <div class="flex gap-2 flex-1">
      <InputField name="name" placeholder="Add title" {handleInput} {formData} {formErrors} />

      <ColorChoiceField name="colorId" data={formData} className="flex-1" />
    </div>
  </div>

  <div class="flex justify-end gap-2">
    {#if !isCreate}
      <button
        type="submit"
        class="btn font-bold btn-ghost"
        onclick={handleCalendarStopEditing}
        disabled={$isSubmitting || isMutationPending}
      >
        Cancel
      </button>
    {/if}

    <button
      type="submit"
      class="btn btn-base-300 font-bold"
      disabled={$isSubmitting || isMutationPending}
    >
      Save
    </button>
  </div>
</form>
