<script lang="ts">
  import { onMount } from "svelte";

  import { AlignLeft, Clock3 } from "@lucide/svelte";

  import { addMinutes, format, formatISO, parseISO } from "date-fns";

  import { CalendarField, InputField, TimeField } from "$lib/client/components";
  import TextareaField from "$lib/client/components/form/textarea-field.svelte";
  import { createForm } from "$lib/client/utils/create-form";

  import type { EventForm } from "$lib/types";

  import { eventSchema } from "../../schema";

  const now = new Date();
  const fifteenMinsLater = addMinutes(now, 15);

  let defaultValues: EventForm = {
    calendarId: "",
    summary: "",
    description: "",
    color: "",
    bgColor: "",
    startDate: now.toISOString(),
    startTime: now.toISOString(),
    startTimeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    endDate: now.toISOString(),
    endTime: fifteenMinsLater.toISOString(),
    endTimeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
  };

  let { formData, formErrors, isSubmitting, handleInput, handleSubmit, setDisabledFields } =
    createForm({
      schema: eventSchema,
      defaultValues
    });

  onMount(() => {
    setDisabledFields(["startTimeZone", "endTimeZone"]);
  });

  async function onSubmit() {
    console.log("Submitted...");
    console.log("Form data:", $formData);
  }
</script>

<form onsubmit={handleSubmit(onSubmit)}>
  <InputField
    name="summary"
    placeholder="Add title"
    className="my-2"
    {handleInput}
    {formData}
    {formErrors}
  />

  <div class="flex my-2 items-start gap-3 w-full">
    <div class="pt-[6px] text-muted-foreground">
      <Clock3 size="20" strokeWidth="2.5" />
    </div>

    <div class="flex flex-col gap-2 w-full">
      <div class="flex gap-2 w-full">
        <CalendarField
          name="startDate"
          className="w-full basis-[60%]"
          {handleInput}
          {formData}
          {formErrors}
        />
        <TimeField
          name="startTime"
          className="w-full basis-[40%]"
          {handleInput}
          {formData}
          {formErrors}
        />
      </div>

      <div class="flex gap-2 w-full">
        <CalendarField
          name="endDate"
          className="w-full basis-[60%]"
          {handleInput}
          {formData}
          {formErrors}
        />
        <TimeField
          name="endTime"
          className="w-full basis-[40%]"
          {handleInput}
          {formData}
          {formErrors}
        />
      </div>
    </div>
  </div>

  <!-- <InputField name="calendarId" placeholder="calendarId" {handleInput} {formData} {formErrors} />
  <InputField name="color" placeholder="Color" {handleInput} {formData} {formErrors} />
  <InputField name="bgColor" placeholder="Bg Color" {handleInput} {formData} {formErrors} /> -->

  <div class="flex my-2 items-start gap-3 w-full">
    <div class="pt-[6px] text-muted-foreground">
      <AlignLeft size="20" strokeWidth="2.5" />
    </div>

    <div class="w-full">
      <TextareaField
        name="description"
        placeholder="Description"
        {handleInput}
        {formData}
        {formErrors}
      />
    </div>
  </div>

  <div class="my-2 mt-3">
    <button type="submit" class="btn bg-base-200 font-bold w-full" disabled={$isSubmitting}>
      Save
    </button>
  </div>
</form>
