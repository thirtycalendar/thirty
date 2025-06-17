<script lang="ts">
  import { AlignLeft, CalendarCheck2, Clock3 } from "@lucide/svelte";

  import { addDays, format, startOfDay } from "date-fns";

  import {
    CalendarChoiceField,
    CalendarField,
    InputField,
    TimeField
  } from "$lib/client/components";
  import ColorChoiceField from "$lib/client/components/form/color-choice-field.svelte";
  import TextareaField from "$lib/client/components/form/textarea-field.svelte";
  import { createForm } from "$lib/client/utils/create-form";

  import type { Calendar, EventForm } from "$lib/types";

  import { getCalList } from "../../calendar/query";
  import { eventSchema } from "../schema";

  const { calendarList } = getCalList();

  const now = new Date();
  const today = startOfDay(now);

  let initialCalendarId: string = "";
  let initialColorId: string = "";
  $effect(() => {
    if ($calendarList && !initialCalendarId) {
      const primaryCalendar: Calendar | undefined = $calendarList.find((cal) => cal.isPrimary);

      if (primaryCalendar) {
        initialCalendarId = primaryCalendar.id;
        initialColorId = primaryCalendar.colorId;

        $formData.calendarId = initialCalendarId;
        $formData.colorId = initialColorId;
      }
    }
  });

  let defaultValues: EventForm = {
    calendarId: initialCalendarId,
    externalId: null,
    source: "local",
    name: "",
    description: null,
    location: null,
    colorId: initialColorId,
    start: today.toISOString(),
    end: format(now, "HH:mm"),
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    allDay: false,
    status: "confirmed"
  };

  let { formData, formErrors, isSubmitting, handleInput, handleSubmit } = createForm({
    schema: eventSchema,
    defaultValues
  });

  let isNextDay = $derived($formData.start > $formData.end);

  $effect(() => {
    const { start, end } = $formData;

    const currentStartDate = startOfDay(new Date(start));
    const currentEndDate = startOfDay(new Date(end));

    if (currentStartDate > currentEndDate) {
      const expectedEndDate = addDays(currentStartDate, 1);

      if (currentEndDate.getTime() !== expectedEndDate.getTime()) {
        $formData.end = expectedEndDate.toISOString();
      }
    } else {
      const expectedEndDate = currentStartDate;

      if (currentEndDate.getTime() !== expectedEndDate.getTime()) {
        $formData.end = expectedEndDate.toISOString();
      }
    }
  });

  async function onSubmit() {
    console.log("Submitted...");
    console.log("Form data:", $formData);
  }
</script>

{#if $calendarList}
  <form onsubmit={handleSubmit(onSubmit)}>
    <InputField name="name" placeholder="Add title" {handleInput} {formData} {formErrors} />

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
              isRightDiv={true}
              {handleInput}
              {formData}
              {formErrors}
            />
          </div>
        </div>
      {/if}
    </div>

    <div class="flex my-2 items-start gap-3 w-full">
      <div class="pt-[6px] text-muted-foreground">
        <CalendarCheck2 size="20" strokeWidth="2.5" />
      </div>

      <div class="flex gap-2 w-full">
        <div class="w-full basis-[75%]">
          <CalendarChoiceField
            name="calendarId"
            choiceList={$calendarList}
            placeholder="calendarId"
            {handleInput}
            {formData}
            {formErrors}
          />
        </div>

        <div class="w-full basis-[25%]">
          <ColorChoiceField
            name="colorId"
            placeholder="Color Id"
            {handleInput}
            {formData}
            {formErrors}
          />
        </div>
      </div>
    </div>

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
{/if}
