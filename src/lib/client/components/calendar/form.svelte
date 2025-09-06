<script lang="ts">
  import { GlobalRefreshIcon, PaintBoardIcon } from "@hugeicons/core-free-icons";

  import { calendarModalStore } from "$lib/client/stores/modal";
  import { createForm } from "$lib/client/utils/create-form";

  import { calendarSchema } from "$lib/shared/schemas";
  import type { CalendarForm } from "$lib/shared/types";

  import { ColorChoiceField, FormActionButtons, InputField, TimezoneField } from "../form";

  import { IconRow } from "..";

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

<form onsubmit={handleSubmit()} class="form-section">
  {#if errorMessage !== ""}
    <p class="error-text">{errorMessage}</p>
  {/if}

  <!-- Name -->
  <InputField name="name" placeholder="Add title" {handleInput} {formData} {formErrors} />

  <!-- Color -->
  <IconRow icon={PaintBoardIcon}>
    <ColorChoiceField name="color" {formData} {formErrors} />
  </IconRow>

  <!-- Timezone -->
  <IconRow icon={GlobalRefreshIcon}>
    <TimezoneField name="timezone" {formData} {formErrors} />
  </IconRow>

  <!-- Primary -->
  <label class="flex w-full cursor-pointer items-center gap-3">
    <input
      name="isPrimary"
      type="checkbox"
      class="checkbox checkbox-sm"
      oninput={handleInput}
      checked={$formData.isPrimary}
    />
    <span class="text-sm">Primary</span>
  </label>

  <!-- Form Actions -->
  <FormActionButtons
    {isCreate}
    isSaving={$isSubmitting || isMutationPending}
    isDisabled={$isSubmitting || isMutationPending}
    onCancel={calendarModalStore.stopEditing}
  />
</form>
