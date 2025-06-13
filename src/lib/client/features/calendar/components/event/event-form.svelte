<script lang="ts">
  import { AlignLeft, Clock3 } from "@lucide/svelte";

  import { addDays, addMinutes, format, startOfDay } from "date-fns";

  import { CalendarField, InputField, TimeField } from "$lib/client/components";
  import TextareaField from "$lib/client/components/form/textarea-field.svelte";
  import { createForm } from "$lib/client/utils/create-form";

  import type { EventForm } from "$lib/types";

  import { eventSchema } from "../../schema";

  const now = new Date();
  const today = startOfDay(now);

  let defaultValues: EventForm = {
    calendarId: "",
    summary: "",
    description: "",
    color: "",
    bgColor: "",
    startDate: today.toISOString(),
    startTime: format(now, "HH:mm"),
    startTimeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    endDate: today.toISOString(),
    endTime: format(addMinutes(now, 30), "HH:mm"),
    endTimeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
  };

  let { formData, formErrors, isSubmitting, handleInput, handleSubmit } = createForm({
    schema: eventSchema,
    defaultValues
  });

  let isNextDay = $derived($formData.startTime > $formData.endTime);

  $effect(() => {
    const { startDate, startTime, endTime, endDate } = $formData;

    const currentStartDate = startOfDay(new Date(startDate));
    const currentEndDate = startOfDay(new Date(endDate));

    if (startTime > endTime) {
      const expectedEndDate = addDays(currentStartDate, 1);

      if (currentEndDate.getTime() !== expectedEndDate.getTime()) {
        $formData.endDate = expectedEndDate.toISOString();
      }
    } else {
      const expectedEndDate = currentStartDate;

      if (currentEndDate.getTime() !== expectedEndDate.getTime()) {
        $formData.endDate = expectedEndDate.toISOString();
      }
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
    className="my-2"
    {handleInput}
    {formData}
    {formErrors}
  />

  <div class="flex my-2 items-start gap-3 w-full">
    <div class="pt-[6px] text-muted-foreground">
      <Clock3 size="20" strokeWidth="2.5" />
    </div>

    {#if isNextDay}
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
            isDisablePast={true}
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
    {:else}
      <div class="flex flex-col gap-2 w-full">
        <div class="flex gap-2 w-full">
          <CalendarField
            name="startDate"
            className="w-full basis-[50%]"
            {handleInput}
            {formData}
            {formErrors}
          />

          <TimeField
            name="startTime"
            className="w-full basis-[25%]"
            {handleInput}
            {formData}
            {formErrors}
          />

          <TimeField
            name="endTime"
            className="w-full basis-[25%]"
            {handleInput}
            {formData}
            {formErrors}
          />
        </div>
      </div>
    {/if}
  </div>

  <InputField name="calendarId" placeholder="calendarId" {handleInput} {formData} {formErrors} />
  <InputField name="color" placeholder="Color" {handleInput} {formData} {formErrors} />
  <InputField name="bgColor" placeholder="Bg Color" {handleInput} {formData} {formErrors} />

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
