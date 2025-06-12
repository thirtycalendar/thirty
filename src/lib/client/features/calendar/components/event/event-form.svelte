<script lang="ts">
  import { onMount } from "svelte";

  import { addMinutes, differenceInCalendarDays, formatISO, parseISO } from "date-fns";

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

  // Derived: is the endTime on the next calendar day compared to startTime?
  let isNextDay = $derived(() => {
    const start = parseISO($formData.startTime);
    const end = parseISO($formData.endTime);
    return differenceInCalendarDays(end, start) > 0;
  });

  // Keep endDate in sync with endTime if it's next day
  $effect(() => {
    if (isNextDay()) {
      setDisabledFields(["endDate"]);
      formData.update((data) => ({
        ...data,
        endDate: formatISO(parseISO(data.endTime), { representation: "date" })
      }));
    }
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

  <InputField name="calendarId" placeholder="calendarId" {handleInput} {formData} {formErrors} />
  <InputField name="color" placeholder="Color" {handleInput} {formData} {formErrors} />
  <InputField name="bgColor" placeholder="Bg Color" {handleInput} {formData} {formErrors} />

  <CalendarField name="startDate" {handleInput} {formData} {formErrors} />
  <TimeField name="startTime" {handleInput} {formData} {formErrors} />

  {#if isNextDay()}
    <CalendarField name="endDate" {handleInput} {formData} {formErrors} />
  {/if}

  <TimeField name="endTime" {handleInput} {formData} {formErrors} />

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
