<script lang="ts">
  import { writable, type Writable } from "svelte/store";

  import { AlignLeft, CalendarCheck2, Clock3, MapPin } from "@lucide/svelte";

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
  import { getCalendars } from "../../calendar/query";
  import { eventSchema } from "../schema";

  interface EventDataType {
    calendarId: string;
    colorId: string;
    startDate: string;
    startTime: string;
    endDate: string;
    endTime: string;
    timezone: string;
  }

  let isLocation = $state(false);
  let isDescription = $state(false);

  const { data: calendars } = getCalendars();
  const now = new Date();

  const eventData: Writable<EventDataType> = writable({
    calendarId: "",
    colorId: "",
    startDate: format(now, "yyyy-MM-dd"),
    startTime: format(now, "HH:mm"),
    endDate: format(now, "yyyy-MM-dd"),
    endTime: format(addMinutes(now, 30), "HH:mm"),
    timezone: ""
  });

  const isNextDay = $derived($eventData.startTime > $eventData.endTime);

  const defaultValues: EventForm = {
    calendarId: "",
    externalId: null,
    source: "local",
    name: "",
    description: null,
    location: null,
    colorId: "",
    start: "",
    end: "",
    timezone: "",
    allDay: false,
    status: "confirmed"
  };

  const { formData, formErrors, isSubmitting, handleInput, handleSubmit } = createForm({
    schema: eventSchema,
    defaultValues,
    disabledFields: ["start", "end", "timezone"]
  });

  $effect(() => {
    if ($calendars) {
      const primaryCalendar = $calendars.find((cal) => cal.isPrimary);

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

      if (isNextDay && $event.endDate === format(now, "yyyy-MM-dd")) {
        $event.endDate = format(addDays(now, 1), "yyyy-MM-dd");
      }
    });
  });

  $effect(() => {
    if ($calendars) {
      const selectedCalendar = $calendars.find((c) => c.id === $eventData.calendarId);
      if (selectedCalendar) {
        if ($eventData.colorId !== selectedCalendar.colorId) {
          $eventData.colorId = selectedCalendar.colorId;
        }
        if ($eventData.timezone !== selectedCalendar.timezone) {
          $eventData.timezone = selectedCalendar.timezone;
        }
      }
    }
  });

  async function onSubmit() {
    // TODO: Implement form submission logic
    console.log("Form submitted:", $formData);
  }
</script>

{#if $calendars}
  <form onsubmit={handleSubmit(onSubmit)} class="space-y-2">
    <InputField name="name" placeholder="Add title" {handleInput} {formData} {formErrors} />

    <div class="flex items-start gap-3">
      <div class="pt-1.5 text-muted-foreground">
        <Clock3 size="20" strokeWidth="2.5" />
      </div>

      <div class="flex-1">
        {#if isNextDay}
          <div class="space-y-2">
            <div class="flex gap-2">
              <DateField name="startDate" data={eventData} className="flex-[3]" />
              <TimeField name="startTime" data={eventData} className="flex-[2]" />
            </div>

            <div class="flex gap-2">
              <DateField
                name="endDate"
                data={eventData}
                className="flex-[3]"
                isDisablePast={true}
              />
              <TimeField name="endTime" data={eventData} className="flex-[2]" />
            </div>
          </div>
        {:else}
          <div class="flex gap-2">
            <DateField name="startDate" data={eventData} className="flex-[2]" />
            <TimeField name="startTime" data={eventData} className="flex-1" />
            <TimeField name="endTime" data={eventData} className="flex-1" isRightDiv={true} />
          </div>
        {/if}
      </div>
    </div>

    <div class="flex items-start gap-3">
      <div class="pt-1.5 text-muted-foreground">
        <CalendarCheck2 size="20" strokeWidth="2.5" />
      </div>

      <div class="flex gap-2 flex-1">
        <CalendarChoiceField
          name="calendarId"
          data={eventData}
          calendars={$calendars}
          placeholder="Select Calendar"
          className="flex-[3]"
        />
        <ColorChoiceField name="colorId" data={eventData} className="flex-1" />
      </div>
    </div>

    <div class="flex items-start gap-3">
      <div class="pt-1.5 text-muted-foreground">
        <MapPin size="20" strokeWidth="2.5" />
      </div>

      <div class="flex-1">
        {#if isLocation}
          <InputField
            name="location"
            placeholder="e.g., London, England"
            {handleInput}
            {formData}
            {formErrors}
          />
        {:else}
          <button
            class="p-1 cursor-pointer text-sm w-full text-left justify-start"
            onclick={() => (isLocation = true)}
          >
            Add <span class="hover:underline">location</span>
          </button>
        {/if}
      </div>
    </div>

    <div class="flex items-start gap-3">
      <div class="pt-1.5 text-muted-foreground">
        <AlignLeft size="20" strokeWidth="2.5" />
      </div>

      <div class="flex-1">
        {#if isDescription}
          <TextareaField
            name="description"
            placeholder="Description"
            {handleInput}
            {formData}
            {formErrors}
          />
        {:else}
          <button
            class="p-1 cursor-pointer text-sm w-full text-left justify-start"
            onclick={() => (isDescription = true)}
          >
            Add <span class="hover:underline">description</span>
          </button>
        {/if}
      </div>
    </div>

    <TimezoneField name="timezone" data={eventData} className="w-full" />

    <button type="submit" class="btn bg-base-200 font-bold w-full" disabled={$isSubmitting}>
      Save
    </button>
  </form>
{/if}
