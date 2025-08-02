<script lang="ts">
  import { Globe, Palette } from "@lucide/svelte";

  import {
    ColorChoiceField,
    FormActionButtons,
    InputField,
    TimezoneField
  } from "$lib/client/components";
  import { calendarModal } from "$lib/client/stores/modal";
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
    isCreate = false
  }: Props = $props();

  const { formData, formErrors, isSubmitting, handleInput, handleSubmit } = createForm({
    schema: calendarSchema,
    defaultValues,
    onSubmit
  });
</script>

<form onsubmit={handleSubmit()} class="space-y-2">
  {#if errorMessage !== ""}
    <p class="text-error mt-1 text-sm">{errorMessage}</p>
  {/if}

  <InputField name="name" placeholder="Add title" {handleInput} {formData} {formErrors} />

  <div class="flex items-start gap-3">
    <div class="text-muted-foreground pt-1.5">
      <Palette size="20" strokeWidth="2.5" />
    </div>

    <div class="flex flex-1 gap-2">
      <ColorChoiceField name="color" {formData} {formErrors} isLeftDiv />
    </div>
  </div>

  <div class="flex items-start gap-3">
    <div class="text-muted-foreground pt-1.5">
      <Globe size="20" strokeWidth="2.5" />
    </div>

    <div class="flex flex-1 gap-2">
      <TimezoneField name="timezone" {formData} {formErrors} />
    </div>
  </div>

  <div class="w-full">
    <label class="w-full cursor-pointer">
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

  <FormActionButtons
    {isCreate}
    isSaving={$isSubmitting || isMutationPending}
    isDisabled={$isSubmitting || isMutationPending}
    onCancel={calendarModal.stopEditing}
  />
</form>
