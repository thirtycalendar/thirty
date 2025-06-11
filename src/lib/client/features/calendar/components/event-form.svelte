<script lang="ts">
  import { InputField } from "$lib/client/components";
  import { createForm } from "$lib/client/utils/create-form";

  import type { EventForm } from "$lib/types";

  import { eventSchema } from "../schema";

  let defaultValues: EventForm = {
    calendarId: "",
    summary: "",
    description: "",
    color: "",
    bgColor: "",
    startDateTime: "",
    startTimeZone: "",
    endDateTime: "",
    endTimeZone: ""
  };

  const { formData, formErrors, isSubmitting, handleInput, handleSubmit } = createForm({
    schema: eventSchema,
    defaultValues
  });

  // Accept data argument, which createForm passes on submit
  async function onSubmit(data: EventForm) {
    console.log("Submitted...");
    console.log("Form data:", data);
  }
</script>

<form on:submit={handleSubmit(onSubmit)}>
  <InputField name="calendarId" placeholder="Name" {handleInput} {formData} {formErrors} />
  <InputField name="summary" placeholder="Summary" {handleInput} {formData} {formErrors} />
  <InputField name="description" placeholder="Description" {handleInput} {formData} {formErrors} />
  <InputField name="color" placeholder="Color" {handleInput} {formData} {formErrors} />
  <InputField name="bgColor" placeholder="Bg Color" {handleInput} {formData} {formErrors} />
  <InputField name="startDateTime" placeholder="Start date" {handleInput} {formData} {formErrors} />
  <InputField name="startTimeZone" placeholder="Start time" {handleInput} {formData} {formErrors} />
  <InputField name="endDateTime" placeholder="End date" {handleInput} {formData} {formErrors} />
  <InputField name="endTimeZone" placeholder="End time" {handleInput} {formData} {formErrors} />

  <button type="submit" class="btn bg-base-200 font-bold flex-grow" disabled={$isSubmitting}>
    Save
  </button>
</form>
