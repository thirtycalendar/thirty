<script lang="ts">
  import { Globe, Palette } from "@lucide/svelte";

  import { ColorChoiceField, InputField, TimezoneField } from "$lib/client/components";
  import { handleCalendarStopEditing } from "$lib/client/stores/calendar";
  import { createForm } from "$lib/client/utils/create-form";

  import type { CalendarForm } from "$lib/shared/types";

  import { calendarSchema } from "../../../../shared/schemas/calendar";

  interface Props {
    defaultValues: CalendarForm;
    onSubmit: (data: CalendarForm) => Promise<void>;
    isMutationPending: boolean;
    errorMessage: string;
    isCreate?: boolean;
  }

  let {
    defaultValues,
    onSubmit,
    isMutationPending,
    errorMessage = $bindable(),
    isCreate
  }: Props = $props();

  const { formData, formErrors, isSubmitting, handleInput, handleSubmit } = createForm({
    schema: calendarSchema,
    defaultValues
  });
</script>

<form onsubmit={handleSubmit((data) => onSubmit(data as CalendarForm))} class="space-y-2">
  {#if errorMessage !== ""}
    <p class="text-sm text-error mt-1">{errorMessage}</p>
  {/if}

  <InputField name="name" placeholder="Add title" {handleInput} {formData} {formErrors} />

  <div class="flex items-start gap-3">
    <div class="pt-1.5 text-muted-foreground">
      <Palette size="20" strokeWidth="2.5" />
    </div>

    <div class="flex gap-2 flex-1">
      <ColorChoiceField name="colorId" {formData} {formErrors} isLeftDiv />
    </div>
  </div>

  <div class="flex items-start gap-3">
    <div class="pt-1.5 text-muted-foreground">
      <Globe size="20" strokeWidth="2.5" />
    </div>

    <div class="flex gap-2 flex-1">
      <TimezoneField name="timezone" {formData} {formErrors} />
    </div>
  </div>

  <div class="w-full">
    <label class="cursor-pointer w-full">
      <input
        name="isPrimary"
        type="checkbox"
        class="checkbox checkbox-sm mr-2"
        oninput={handleInput}
        checked={$formData.isPrimary}
      />

      <span class="text-sm">Primary</span>
    </label>
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
