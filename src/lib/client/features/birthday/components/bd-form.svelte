<script lang="ts">
  import { onMount } from "svelte";

  import { AlignLeft, Palette } from "@lucide/svelte";

  import { ColorChoiceField, InputField, TextareaField } from "$lib/client/components";
  import { handleCalendarStopEditing } from "$lib/client/stores/calendar";
  import { createForm } from "$lib/client/utils/create-form";

  import { birthdaySchema } from "$lib/shared/schemas/birthday";
  import type { BirthdayForm } from "$lib/shared/types";

  interface BirthdayFormProps {
    defaultValues: BirthdayForm;
    onSubmit: (data: BirthdayForm) => Promise<void>;
    isMutationPending: boolean;
    isCreate?: boolean;
  }

  let {
    defaultValues,
    onSubmit,
    isMutationPending,
    isCreate = false
  }: BirthdayFormProps = $props();

  const { formData, formErrors, isSubmitting, handleInput, handleSubmit } = createForm({
    schema: birthdaySchema,
    defaultValues
  });

  let isDescription = $state(defaultValues.description ? true : false);

  onMount(() => {
    return () => {
      isDescription = false;
    };
  });
</script>

<form onsubmit={handleSubmit((data) => onSubmit(data as BirthdayForm))} class="space-y-2">
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
      <AlignLeft size="20" strokeWidth="2.5" />
    </div>
    <div class="flex-1">
      {#if isDescription}
        <TextareaField
          name="description"
          placeholder="Description"
          {handleInput}
          {formData}
          {formErrors}
        />
      {:else}
        <button
          type="button"
          class="p-1.5 w-full text-left text-sm"
          onclick={() => (isDescription = true)}
        >
          Add <span class="hover:underline">description</span>
        </button>
      {/if}
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
