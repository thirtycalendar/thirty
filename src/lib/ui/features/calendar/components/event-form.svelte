<script lang="ts">
  import { createForm } from "$lib/ui/utils/create-form";
  import { InputField } from "$lib/ui/components";

  import type { EventForm } from "$lib/types";

  import { eventSchema } from "../schema";

  let defaultValues: EventForm = {
    name: "",
    calendar: "",
    date: "",
    timeFrom: "",
    timeTo: "",
    location: "",
    description: "",
    notifyIn: ""
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
  <InputField name="name" placeholder="Name" {handleInput} {formData} {formErrors} />

  <button type="submit" class="btn bg-base-200 font-bold flex-grow" disabled={$isSubmitting}>
    Save
  </button>
</form>
