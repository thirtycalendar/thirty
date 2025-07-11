<script lang="ts">
  import { onMount } from "svelte";

  import { endOfDay, format, isToday, setHours, startOfDay } from "date-fns";

  import { calculateEventOffsets, getEventDateObjects } from "$lib/client/features/event/utils";
  import { currentDate } from "$lib/client/stores/change-date";
  import { uncheckedBirthdays, uncheckedCalendars } from "$lib/client/stores/local-storage";

  import type { Birthday, Event } from "$lib/shared/types";

  import { BdBlock } from "../../birthday/components";
  import { getBirthdaysForDay, getVisibleBirthdays } from "../../birthday/utils";
  import { AllDayEventBlock, EventBlock } from "../../event/components";
  import { getVisibleEvents } from "../utils";

  import { CurrentTimeIndicator } from ".";

  interface Props {
    events: Event[];
    birthdays: Birthday[];
  }

  let { events, birthdays }: Props = $props();

  const hours = Array.from({ length: 24 }, (_, i) => i);

  const dayStart = $derived(startOfDay($currentDate));
  const dayEnd = $derived(endOfDay($currentDate));

  const { store: uncheckedBds } = uncheckedBirthdays;
  const visibleBirthdays = $derived.by(() => getVisibleBirthdays(birthdays, $uncheckedBds));

  const { store: unchecked } = uncheckedCalendars;
  const { allDayEvents, timedEvents } = $derived.by(() => {
    return getVisibleEvents(events, dayStart, dayEnd, $unchecked);
  });

  const timedEventChunks = $derived.by(() => {
    const chunks = timedEvents.map((event) => {
      const { start, end } = getEventDateObjects(event);
      return {
        event,
        start: start < dayStart ? dayStart : start,
        end: end > dayEnd ? dayEnd : end
      };
    });
    const offsets = calculateEventOffsets(chunks);
    return chunks.map((chunk) => ({ ...chunk, offset: offsets.get(chunk) ?? 0 }));
  });

  let scrollContainer: HTMLDivElement;
  let now = new Date();

  function getLineOffset(date = now) {
    const hourOffset = 2;
    const minutes = (date.getHours() - hourOffset) * 60 + date.getMinutes();
    const clampedMinutes = Math.max(0, minutes);
    return (clampedMinutes / 60) * 60;
  }

  onMount(() => {
    requestAnimationFrame(() => {
      if (scrollContainer) {
        scrollContainer.scrollTop = getLineOffset();
      }
    });
  });
</script>

<div class="flex flex-col h-full px-2">
  <div class="bg-base-200 sticky top-0 z-10 border-b border-base-200">
    <div
      class={`font-semibold text-center ${isToday($currentDate) ? "text-primary-content" : "text-primary-content/70"}`}
    >
      <span class="flex items-center justify-center">
        {#if isToday($currentDate)}
          <span class="w-2 h-2 rounded-full bg-primary-content mr-1"></span>
        {/if}

        {format($currentDate, "EEEE, MMM d")}
      </span>
    </div>
  </div>

  {#if allDayEvents.length > 0 || visibleBirthdays.length > 0}
    <div class="bg-base-200 border-b border-base-200 grid grid-cols-[50px_1fr]">
      <div></div>
      <div class="flex flex-col gap-1 py-1 min-w-0">
        {#each getBirthdaysForDay(visibleBirthdays, $currentDate) as bd (bd.id)}
          <BdBlock birthday={bd} />
        {/each}

        {#each allDayEvents as event (event.id)}
          <AllDayEventBlock {event} />
        {/each}
      </div>
    </div>
  {/if}

  <div
    bind:this={scrollContainer}
    class="flex-1 overflow-y-auto overflow-x-hidden bg-base-100 relative rounded-2xl"
  >
    <div class="grid grid-cols-[50px_1fr] relative">
      {#each hours as hour (hour)}
        <div
          class="col-start-1 h-15 flex justify-center items-center select-none leading-none text-xs text-primary-content/70 border-r border-base-200"
        >
          {format(setHours(new Date(), hour), "h a")}
        </div>
        <div class="col-start-2 border-b border-base-200"></div>
      {/each}

      <div class="col-start-2 row-start-1 col-span-1 row-span-full relative pointer-events-none">
        <div class="absolute inset-0 pointer-events-auto">
          {#each timedEventChunks as { event, start, end, offset } (event.id)}
            <EventBlock {event} {start} {end} {offset} />
          {/each}

          {#if isToday($currentDate)}
            <CurrentTimeIndicator day={$currentDate} />
          {/if}
        </div>
      </div>
    </div>
  </div>
</div>
