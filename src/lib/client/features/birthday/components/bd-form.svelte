<script lang="ts">
  import { AlignLeft, CalendarCheck2 } from "@lucide/svelte";

  import {
    ColorChoiceField,
    DateField,
    FormActionButtons,
    InputField,
    TextareaField
  } from "$lib/client/components";
  import { handleBirthdayStopEditing } from "$lib/client/stores/birthday";
  import { createForm } from "$lib/client/utils/create-form";

  import { birthdaySchema } from "$lib/shared/schemas/birthday";
  import type { BirthdayForm } from "$lib/shared/types";

  interface Props {
    defaultValues: BirthdayForm;
    onSubmit: (data: BirthdayForm) => Promise<void>;
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

  let isNote = $state(defaultValues.note ? true : false);

  const { formData, formErrors, isSubmitting, handleInput, handleSubmit } = createForm({
    schema: birthdaySchema,
    defaultValues,
    onSubmit,
    onSuccess: () => {
      isNote = false;
    }
  });
</script>

<form onsubmit={handleSubmit()} class="space-y-2">
  {#if errorMessage !== ""}
    <p class="text-sm text-error mt-1">{errorMessage}</p>
  {/if}

  <InputField name="name" placeholder="Add title" {handleInput} {formData} {formErrors} />

  <div class="flex items-start gap-3">
    <div class="pt-1.5 text-muted-foreground">
      <CalendarCheck2 size="20" strokeWidth="2.5" />
    </div>
    <div class="flex flex-1 gap-2">
      <DateField name="dob" className="flex-[3]" {formData} {formErrors} />

      <ColorChoiceField name="colorId" className="flex-1" {formData} {formErrors} />
    </div>
  </div>

  <div class="flex items-start gap-3">
    <div class="pt-1.5 text-muted-foreground">
      <AlignLeft size="20" strokeWidth="2.5" />
    </div>
    <div class="flex-1">
      {#if isNote}
        <TextareaField name="note" placeholder="Note" {handleInput} {formData} {formErrors} />
      {:else}
        <button
          type="button"
          class="p-1.5 w-full text-left text-sm"
          onclick={() => (isNote = true)}
        >
          Add <span class="hover:underline">note</span>
        </button>
      {/if}
    </div>
  </div>

  <FormActionButtons
    {isCreate}
    isSaving={$isSubmitting || isMutationPending}
    isDisabled={$isSubmitting || isMutationPending}
    onCancel={handleBirthdayStopEditing}
  />
</form>
