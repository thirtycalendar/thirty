<script lang="ts">
  import { InputField } from "$lib/client/components";
  import { createForm } from "$lib/client/utils/create-form";

  import type { Event } from "$lib/types";

  import { eventSchema } from "../schema";

  let defaultValues: Omit<Event, "id"> = {
    calendarId: "",
    summary: "",
    description: "",
    color: "",
    bgColor: "",
    start: {
      dateTime: "",
      timeZone: ""
    },
    end: {
      dateTime: "",
      timeZone: ""
    }
  };

  let { formData, formErrors, isSubmitting, handleInput, handleSubmit } = createForm({
    schema: eventSchema,
    defaultValues
  });

  function onSubmit() {
    console.log("Submitted...");
    console.log("Form data:", $formData);
  }
</script>

<form onsubmit={handleSubmit(onSubmit)}>
  <InputField name="calendarId" placeholder="Name" {handleInput} {formData} {formErrors} />
  <InputField name="summary" placeholder="Summary" {handleInput} {formData} {formErrors} />
  <InputField name="description" placeholder="Description" {handleInput} {formData} {formErrors} />
  <InputField name="color" placeholder="Color" {handleInput} {formData} {formErrors} />
  <InputField name="bgColor" placeholder="Bg Color" {handleInput} {formData} {formErrors} />
  <InputField
    name="start.dateTime"
    placeholder="Start date"
    {handleInput}
    {formData}
    {formErrors}
  />
  <InputField
    name="start.timeZone"
    placeholder="Start time"
    {handleInput}
    {formData}
    {formErrors}
  />
  <InputField name="end.dateTime" placeholder="End date" {handleInput} {formData} {formErrors} />
  <InputField name="end.timeZone" placeholder="End time" {handleInput} {formData} {formErrors} />

  <button type="submit" class="btn bg-base-200 font-bold flex-grow" disabled={$isSubmitting}>
    Save
  </button>
</form>
