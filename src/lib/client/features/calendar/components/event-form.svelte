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
  <InputField name="summary" placeholder="Name" {handleInput} {formData} {formErrors} />

  <button type="submit" class="btn bg-base-200 font-bold flex-grow" disabled={$isSubmitting}>
    Save
  </button>
</form>
