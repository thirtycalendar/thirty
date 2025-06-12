<script lang="ts">
  import { onMount } from "svelte";

  import { Clock3 } from "@lucide/svelte";

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
    className="text-lg"
    {handleInput}
    {formData}
    {formErrors}
  />

  <div class="my-2 flex w-full">
    <div class="w-">
      <Clock3 />
    </div>

    <div>
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

      <div class="flex gap-1 w-full">
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

  <InputField name="calendarId" placeholder="calendarId" {handleInput} {formData} {formErrors} />
  <InputField name="color" placeholder="Color" {handleInput} {formData} {formErrors} />
  <InputField name="bgColor" placeholder="Bg Color" {handleInput} {formData} {formErrors} />

  <TextareaField
    name="description"
    placeholder="Description"
    {handleInput}
    {formData}
    {formErrors}
  />

  <button type="submit" class="btn bg-base-200 font-bold flex-grow" disabled={$isSubmitting}>
    Save
  </button>
</form>
