<script lang="ts">
  import { CalendarField, InputField } from "$lib/client/components";
  import { createForm } from "$lib/client/utils/create-form";

  import type { EventForm } from "$lib/types";

  import { eventSchema } from "../../schema";

  let defaultValues: EventForm = {
    calendarId: "",
    summary: "",
    description: "",
    color: "",
    bgColor: "",
    startDate: new Date().toISOString(),
    startTime: new Date().toISOString(),
    startTimeZone: "",
    endDate: new Date().toISOString(),
    endTime: new Date().toISOString(),
    endTimeZone: ""
  };

  const { formData, formErrors, isSubmitting, handleInput, handleSubmit } = createForm({
    schema: eventSchema,
    defaultValues
  });

  async function onSubmit() {
    console.log("Submitted...");
    console.log("Form data:", $formData);
  }
</script>

<form on:submit={handleSubmit(onSubmit)}>
  <InputField name="calendarId" placeholder="Name" {handleInput} {formData} {formErrors} />
  <InputField name="summary" placeholder="Summary" {handleInput} {formData} {formErrors} />
  <InputField name="description" placeholder="Description" {handleInput} {formData} {formErrors} />
  <InputField name="color" placeholder="Color" {handleInput} {formData} {formErrors} />
  <InputField name="bgColor" placeholder="Bg Color" {handleInput} {formData} {formErrors} />
  <CalendarField name="startDate" {handleInput} {formData} {formErrors} />
  <InputField name="startTime" placeholder="Start time" {handleInput} {formData} {formErrors} />
  <InputField
    name="startTimeZone"
    placeholder="Start time zone"
    {handleInput}
    {formData}
    {formErrors}
  />
  <CalendarField name="endDate" {handleInput} {formData} {formErrors} />
  <InputField name="endTime" placeholder="End time" {handleInput} {formData} {formErrors} />
  <InputField
    name="endTimeZone"
    placeholder="End time zone"
    {handleInput}
    {formData}
    {formErrors}
  />

  <button type="submit" class="btn bg-base-200 font-bold flex-grow" disabled={$isSubmitting}>
    Save
  </button>
</form>
