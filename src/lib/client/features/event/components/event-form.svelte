<script lang="ts">
  import { writable } from "svelte/store";

  import { AlignLeft, CalendarCheck2, Clock3 } from "@lucide/svelte";

  import { addDays, addMinutes, isValid as isValidDate, startOfDay } from "date-fns";
  import { format } from "date-fns-tz";

  import {
    ColorChoiceField,
    DateField,
    InputField,
    TextareaField,
    TimeField
  } from "$lib/client/components";
  import { createForm } from "$lib/client/utils/create-form";

  import type { Calendar, EventForm } from "$lib/types";

  import { CalendarChoiceField } from "../../calendar/components";
  import { getCalList } from "../../calendar/query";
  import { eventSchema } from "../schema";

  const { calendarList } = getCalList();

  const now = new Date();

  let eventData = writable({
    calendarId: "",
    colorId: "",
    startDate: format(now, "yyyy-MM-dd"),
    startTime: format(now, "HH:mm"),
    endTime: format(addMinutes(now, 30), "HH:mm"),
    endDate: format(now, "yyyy-MM-dd"),

    start: "",
    end: "",

    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
  });

  $effect(() => {
    if ($calendarList) {
      const primaryCalendar: Calendar | undefined = $calendarList.find((cal) => cal.isPrimary);

      if (primaryCalendar) {
        const calendarId = primaryCalendar.id;
        const colorId = primaryCalendar.colorId;

        $eventData.calendarId = calendarId;
        $eventData.colorId = colorId;

        $formData.calendarId = calendarId;
        $formData.colorId = colorId;
      }
    }
  });

  let defaultValues: EventForm = {
    calendarId: $eventData.calendarId,
    externalId: null,
    source: "local",
    name: "",
    description: null,
    location: null,
    colorId: $eventData.colorId,
    start: $eventData.start,
    end: $eventData.end,
    timezone: $eventData.timezone,
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

    const startDate = new Date(start);
    const endDate = new Date(end);

    if (!isValidDate(startDate) || !isValidDate(endDate)) return;

    const currentStartDate = startOfDay(startDate);
    const currentEndDate = startOfDay(endDate);

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
            <DateField name="startDate" data={eventData} className="w-full basis-[60%]" />

            <TimeField name="startTime" data={eventData} className="w-full basis-[40%]" />
          </div>

          <div class="flex gap-2 w-full">
            <DateField
              name="endDate"
              data={eventData}
              className="w-full basis-[60%]"
              isDisablePast={true}
            />

            <TimeField name="endTime" data={eventData} className="w-full basis-[40%]" />
          </div>
        </div>
      {:else}
        <div class="flex flex-col gap-2 w-full">
          <div class="flex gap-2 w-full">
            <DateField name="startDate" data={eventData} className="w-full basis-[50%]" />

            <TimeField name="startTime" data={eventData} className="w-full basis-[25%]" />

            <TimeField
              name="endTime"
              data={eventData}
              className="w-full basis-[25%]"
              isRightDiv={true}
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
            calendarId={$eventData.calendarId}
            calendars={$calendarList}
            placeholder="calendarId"
          />
        </div>

        <div class="w-full basis-[25%]">
          <ColorChoiceField name="colorId" colorId={$eventData.colorId} />
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
