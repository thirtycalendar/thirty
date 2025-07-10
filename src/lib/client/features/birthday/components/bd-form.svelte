<script lang="ts">
  import { onMount } from "svelte";

  import { AlignLeft, CalendarCheck2 } from "@lucide/svelte";

  import { ColorChoiceField, DateField, InputField, TextareaField } from "$lib/client/components";
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

  let isNote = $state(defaultValues.note ? true : false);

  onMount(() => {
    return () => {
      isNote = false;
    };
  });
</script>

<form onsubmit={handleSubmit((data) => onSubmit(data as BirthdayForm))} class="space-y-2">
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
