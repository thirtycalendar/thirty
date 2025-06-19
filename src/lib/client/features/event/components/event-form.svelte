<script lang="ts">
  import { writable } from "svelte/store";

  import { AlignLeft, CalendarCheck2, Clock3 } from "@lucide/svelte";

  import { addDays, addMinutes } from "date-fns";
  import { format } from "date-fns-tz";

  import {
    ColorChoiceField,
    DateField,
    InputField,
    TextareaField,
    TimeField,
    TimezoneField
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
    endDate: format(now, "yyyy-MM-dd"),
    endTime: format(addMinutes(now, 30), "HH:mm"),
    timezone: ""
  });

  const isNextDay = $derived($eventData.startTime > $eventData.endTime);

  $effect(() => {
    if ($calendarList) {
      const primaryCalendar: Calendar | undefined = $calendarList.find((cal) => cal.isPrimary);

      if (primaryCalendar) {
        $eventData.calendarId = primaryCalendar.id;
        $eventData.colorId = primaryCalendar.colorId;
        $eventData.timezone = primaryCalendar.timezone;
      }
    }

    eventData.subscribe(($event) => {
      $formData.calendarId = $event.calendarId;
      $formData.colorId = $event.colorId;

      $formData.start = `${$event.startDate}T${$event.startTime}`;
      $formData.end = `${$event.endDate}T${$event.endTime}`;

      $formData.timezone = $event.timezone;

      if (isNextDay) {
        $event.endDate = format(addDays(now, 1), "yyyy-MM-dd");
      }
    });
  });

  let defaultValues: EventForm = {
    calendarId: $eventData.calendarId,
    externalId: null,
    source: "local",
    name: "",
    description: null,
    location: null,
    colorId: $eventData.colorId,
    start: "",
    end: "",
    timezone: $eventData.timezone,
    allDay: false,
    status: "confirmed"
  };

  let { formData, formErrors, isSubmitting, handleInput, handleSubmit } = createForm({
    schema: eventSchema,
    defaultValues,
    disabledFields: ["start", "end", "timezone"]
  });

  async function onSubmit() {
    console.log("eventData:", $eventData);

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
          <ColorChoiceField name="colorId" data={eventData} />
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

    <TimezoneField name="timezone" data={eventData} className="w-full basis-[25%]" />

    <div class="my-2 mt-3">
      <button type="submit" class="btn bg-base-200 font-bold w-full" disabled={$isSubmitting}>
        Save
      </button>
    </div>
  </form>
{/if}
