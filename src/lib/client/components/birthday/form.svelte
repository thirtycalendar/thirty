<script lang="ts">
  import { Calendar03Icon, TextAlignLeftIcon } from "@hugeicons/core-free-icons";

  import { birthdayModalStore } from "$lib/client/stores/modal";
  import { createForm } from "$lib/client/utils/create-form";

  import { birthdaySchema } from "$lib/shared/schemas/birthday";
  import type { BirthdayForm } from "$lib/shared/types";

  import {
    ColorChoiceField,
    DateField,
    FormActionButtons,
    InputField,
    TextareaField
  } from "../form";
  import { Icon } from "../icons";

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
    <p class="text-error mt-1 text-sm">{errorMessage}</p>
  {/if}

  <InputField name="name" placeholder="Add title" {handleInput} {formData} {formErrors} />

  <div class="flex items-start gap-3">
    <div class="text-muted-foreground pt-1.5">
      <Icon icon={Calendar03Icon} strokeWidth={1.8} absoluteStrokeWidth />
    </div>
    <div class="flex flex-1 gap-2">
      <DateField name="dob" class="flex-[3]" {formData} {formErrors} />

      <ColorChoiceField name="color" class="flex-1" {formData} {formErrors} />
    </div>
  </div>

  <div class="flex items-start gap-3">
    <div class="text-muted-foreground pt-1.5">
      <Icon icon={TextAlignLeftIcon} strokeWidth={1.8} absoluteStrokeWidth />
    </div>
    <div class="flex-1">
      {#if isNote}
        <TextareaField name="note" placeholder="Note" {handleInput} {formData} {formErrors} />
      {:else}
        <button
          type="button"
          class="w-full p-1.5 text-left text-sm"
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
    onCancel={birthdayModalStore.stopEditing}
  />
</form>
