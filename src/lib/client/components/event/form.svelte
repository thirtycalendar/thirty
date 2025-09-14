<script lang="ts">
  import {
    ArrowRight01Icon,
    Calendar03Icon,
    CheckmarkCircle01Icon,
    Clock01Icon,
    GlobalRefreshIcon,
    MapPinpoint01Icon,
    TextAlignLeftIcon
  } from "@hugeicons/core-free-icons";

  import { addDays, format } from "date-fns";

  import { calendarsQuery } from "$lib/client/data/queries";
  import { eventModalStore } from "$lib/client/stores/modal";
  import { cn } from "$lib/client/utils/cn";
  import { createForm } from "$lib/client/utils/create-form";

  import { eventSchema } from "$lib/shared/schemas";
  import { EventStatuses } from "$lib/shared/constants";
  import type { EventForm } from "$lib/shared/types";

  import {
    CalendarChoiceField,
    ColorChoiceField,
    DateField,
    FormActionButtons,
    FormChoiceField,
    InputField,
    TextareaField,
    TimeField,
    TimezoneField
  } from "../form";
  import { Icon } from "../icons";
  import { draggedEventEnd, draggedEventStart } from "./utils";

  import { IconRow } from "..";

  interface Props {
    defaultValues: EventForm;
    onSubmit: (data: EventForm) => Promise<void>;
    isMutationPending: boolean;
    errorMessage: string;
    isCreate?: boolean;
  }

  let {
    defaultValues = $bindable(),
    onSubmit,
    isMutationPending,
    errorMessage = $bindable(),
    isCreate = false
  }: Props = $props();

  const { data: calendars } = calendarsQuery();

  let hasCalendars = $derived(!!$calendars?.length);

  let isLocation = $state(defaultValues.location ? true : false);
  let isDescription = $state(defaultValues.description ? true : false);
  let isMoreOptions = $state(false);

  const { formData, formErrors, isSubmitting, handleInput, handleSubmit } = createForm({
    schema: eventSchema,
    defaultValues,
    disabledFields: ["timezone"],
    onSubmit,
    onSuccess: () => {
      isLocation = false;
      isDescription = false;
      isMoreOptions = false;

      draggedEventStart.set(null);
      draggedEventEnd.set(null);
    }
  });

  let previousCalendarId = $state($formData.calendarId);

  let isAllDay = $derived($formData.allDay === true);
  let isMultiDay = $derived($formData.startDate !== $formData.endDate);
  let isNotSameDay = $derived(
    $formData.startDate !== $formData.endDate && $formData.startTime < $formData.endTime
  );
  let isTimeInverted = $derived(
    $formData.startDate === $formData.endDate && $formData.startTime > $formData.endTime
  );

  let formErrorMessage = $state("");
  let isErrorMessage = $derived(formErrorMessage !== "");

  $effect(() => {
    if ($formData.startDate > $formData.endDate && $formData.startDate !== $formData.endDate) {
      formErrorMessage = "Start date must be before end date";
    } else {
      formErrorMessage = "";
    }
  });

  $effect(() => {
    if (isCreate && $calendars) {
      const primaryCalendar = $calendars.find((cal) => cal.isPrimary);
      const fallbackCalendar = primaryCalendar ?? $calendars[0];

      if (fallbackCalendar) {
        $formData.calendarId = fallbackCalendar.id;
        $formData.color = fallbackCalendar.color;
        $formData.timezone = fallbackCalendar.timezone;
      }

      if ($draggedEventStart && $draggedEventEnd) {
        $formData.startDate = format($draggedEventStart, "yyyy-MM-dd");
        $formData.startTime = format($draggedEventStart, "HH:mm:ss");
        $formData.endDate = format($draggedEventEnd, "yyyy-MM-dd");
        $formData.endTime = format($draggedEventEnd, "HH:mm:ss");
      }
    }
  });

  // Handle all-day event changes
  $effect(() => {
    if (isAllDay && $formData.endDate !== $formData.startDate) {
      $formData.startTime = "00:00:00";
      $formData.endTime = "23:59:59";
      $formData.endDate = $formData.startDate;
    }
  });

  // Automatically set end date if end time is before start time on the same day
  $effect(() => {
    if (isTimeInverted) {
      $formData.endDate = format(addDays(new Date($formData.startDate), 1), "yyyy-MM-dd");
    } else if (isNotSameDay) {
      $formData.endDate = $formData.startDate;
    }
  });

  //  Sync color and timezone when the selected calendar changes
  $effect(() => {
    if ($calendars) {
      const selectedCalendar = $calendars.find((c) => c.id === $formData.calendarId);
      if (selectedCalendar && previousCalendarId !== $formData.calendarId) {
        previousCalendarId = selectedCalendar.id;
        $formData.color = selectedCalendar.color;
        $formData.timezone = selectedCalendar.timezone;
      }
    }
  });
</script>

{#if $calendars}
  <form onsubmit={handleSubmit()} class="form-section">
    {#if !hasCalendars}
      <p class="error-text">You need to create a calendar before adding events.</p>
    {/if}

    {#if errorMessage !== ""}
      <p class="error-text">{errorMessage}</p>
    {/if}

    {#if isErrorMessage}
      <p class="error-text">{formErrorMessage}</p>
    {/if}

    <!-- Event Name -->
    <InputField name="name" placeholder="Add title" {handleInput} {formData} {formErrors} />

    <!-- Event Time -->
    <IconRow icon={Clock01Icon}>
      {#if !isAllDay}
        {#if isMultiDay}
          <div class="space-y-2">
            <div class="flex gap-2">
              <DateField name="startDate" class="flex-[3]" {formData} {formErrors} />
              <TimeField name="startTime" class="flex-[2]" {formData} {formErrors} />
            </div>
            <div class="flex gap-2">
              <DateField name="endDate" class="flex-[3]" isDisablePast {formData} {formErrors} />
              <TimeField name="endTime" class="flex-[2]" {formData} {formErrors} />
            </div>
          </div>
        {:else}
          <div class="flex items-center gap-2">
            <DateField name="startDate" class="flex-[2]" {formData} {formErrors} />
            <TimeField name="startTime" class="flex-1" {formData} {formErrors} />
            <span class="text-muted-foreground">-</span>
            <TimeField name="endTime" class="flex-1" {formData} {formErrors} />
          </div>
        {/if}
      {:else}
        <DateField name="startDate" class="flex-[3]" {formData} {formErrors} />
      {/if}
    </IconRow>

    <!-- Calendar & Color -->
    <IconRow icon={Calendar03Icon}>
      <div class="flex flex-1 gap-2">
        <CalendarChoiceField
          name="calendarId"
          {formData}
          {formErrors}
          calendars={$calendars}
          placeholder="Select Calendar"
          class="flex-[3]"
        />
        <ColorChoiceField name="color" class="flex-1" {formData} {formErrors} />
      </div>
    </IconRow>

    <!-- Timezone -->
    <IconRow icon={GlobalRefreshIcon}>
      <TimezoneField name="timezone" {formData} {formErrors} />
    </IconRow>

    <!-- Location -->
    <IconRow icon={MapPinpoint01Icon}>
      {#if isLocation}
        <InputField name="location" placeholder="Location" {handleInput} {formData} {formErrors} />
      {:else}
        <button
          type="button"
          class="w-full p-1.5 text-left text-sm"
          onclick={() => (isLocation = true)}
        >
          Add <span class="hover:underline">location</span>
        </button>
      {/if}
    </IconRow>

    <!-- Description -->
    <IconRow icon={TextAlignLeftIcon} class={cn(isDescription && "items-start")}>
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
          type="button"
          class="w-full p-1.5 text-left text-sm"
          onclick={() => (isDescription = true)}
        >
          Add <span class="hover:underline">description</span>
        </button>
      {/if}
    </IconRow>

    <!-- More Options -->
    <button
      type="button"
      class="my-3 flex w-full items-center gap-2 text-sm opacity-75"
      onclick={() => (isMoreOptions = !isMoreOptions)}
    >
      <Icon
        icon={ArrowRight01Icon}
        class={cn("transition-transform duration-300", isMoreOptions && "rotate-90")}
        size={16}
        absoluteStrokeWidth
      />
      <p>More options</p>
    </button>

    {#if isMoreOptions}
      <div class="space-y-3">
        <div>
          <label class="flex cursor-pointer items-center gap-3">
            <input
              name="allDay"
              type="checkbox"
              class="checkbox checkbox-sm"
              oninput={handleInput}
              checked={$formData.allDay}
              disabled={isMultiDay}
            />
            <span class="text-sm select-none">All day</span>
          </label>
        </div>

        <IconRow icon={CheckmarkCircle01Icon}>
          <FormChoiceField
            name="status"
            choiceList={EventStatuses}
            {handleInput}
            {formData}
            {formErrors}
          />
        </IconRow>
      </div>
    {/if}

    <!-- Form Actions -->
    <FormActionButtons
      {isCreate}
      isSaving={$isSubmitting || isMutationPending}
      isDisabled={$isSubmitting || isMutationPending || isErrorMessage || !hasCalendars}
      onCancel={eventModalStore.stopEditing}
    />
  </form>
{/if}
