<script lang="ts">
  import { slide } from "svelte/transition";

  import { Add01Icon, ArrowDown01Icon } from "@hugeicons/core-free-icons";

  import { toggleDraggableModal } from "$lib/client/components/utils";
  import {
    birthdaysQuery,
    calendarsQuery,
    userHolidayCountriesQuery
  } from "$lib/client/data/queries";
  import {
    collapsedLists,
    uncheckedBirthdays,
    uncheckedCalendars,
    uncheckedHolidays
  } from "$lib/client/stores/local-storage";
  import {
    birthdayModalStore,
    calendarModalStore,
    holidayCountryModalStore
  } from "$lib/client/stores/modal";
  import { cn } from "$lib/client/utils/cn";

  import type { Birthday, Calendar, HolidayCountry } from "$lib/shared/types";

  import { Icon } from "../icons";

  const { data: calendars } = calendarsQuery();
  const { data: birthdays } = birthdaysQuery();
  const { data: holidayCountries } = userHolidayCountriesQuery();

  const { store: collapsed } = collapsedLists;
</script>

{#if !$calendars}
  <div class="relative h-[200px]">
    <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/3">
      <span class="loading loading-spinner loading-md"></span>
    </div>
  </div>
{:else}
  {@render Section<Calendar>({
    title: "My Calendars",
    items: $calendars,
    getItemName: (item) => item.name,
    onChecked: (item) => uncheckedCalendars.isChecked(item.id),
    onChange: (item) => uncheckedCalendars.toggle(item.id),
    onAdd: () => toggleDraggableModal(calendarModalStore.modalId),
    onSettings: calendarModalStore.openModal
  })}
{/if}

{#if $birthdays}
  {@render Section<Birthday>({
    title: "Birthdays",
    items: $birthdays,
    getItemName: (item) => item.name,
    onChecked: (item) => uncheckedBirthdays.isChecked(item.id),
    onChange: (item) => uncheckedBirthdays.toggle(item.id),
    onAdd: () => toggleDraggableModal(birthdayModalStore.modalId),
    onSettings: birthdayModalStore.openModal
  })}
{/if}

{#if $holidayCountries}
  {@render Section<HolidayCountry>({
    title: "Holidays",
    items: $holidayCountries,
    getItemName: (item) => item.countryName,
    onChecked: (item) => uncheckedHolidays.isChecked(item.id),
    onChange: (item) => uncheckedHolidays.toggle(item.id),
    onAdd: () => toggleDraggableModal(holidayCountryModalStore.modalId),
    onSettings: holidayCountryModalStore.openModal
  })}
{/if}

{#snippet Section<T extends { id: string; color: string; createdAt?: string } & object>({
  title,
  items,
  getItemName,
  onChecked,
  onChange,
  onAdd,
  onSettings
}: {
  title: string;
  items: T[];
  getItemName: (item: T) => string;
  onChecked: (item: T) => boolean;
  onChange: (item: T) => void;
  onAdd: () => void;
  onSettings?: (item: T) => void;
})}
  {@const sortedItems = [...items].sort(
    (a, b) => new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime()
  )}
  <div>
    <div class="flex w-full items-center justify-between gap-1 rounded-md px-1 text-sm">
      <p class="text-primary-content/70 ml-1 font-semibold">{title}</p>

      <div class="text-primary-content/70 flex items-center gap-1">
        <div class="tooltip font-normal" data-tip="New">
          <button class="btn btn-xs btn-ghost btn-square" onclick={onAdd}>
            <Icon icon={Add01Icon} size={16} absoluteStrokeWidth />
          </button>
        </div>

        <button
          class={cn(
            "btn btn-xs btn-ghost btn-square transition-transform duration-300",
            !$collapsed.includes(title) && "rotate-180"
          )}
          onclick={() => collapsedLists.toggle(title)}
        >
          <Icon icon={ArrowDown01Icon} size={16} absoluteStrokeWidth />
        </button>
      </div>
    </div>

    {#if !$collapsed.includes(title)}
      {#if sortedItems.length > 0}
        <div class="my-1" transition:slide>
          {#each sortedItems as item (item.id)}
            <button
              class="group btn btn-ghost btn-sm flex w-full items-center justify-between px-2 py-1 font-normal"
              onclick={() => onSettings?.(item)}
            >
              <div class="flex items-center gap-2">
                <input
                  type="checkbox"
                  class="checkbox checkbox-xs rounded-sm text-shadow-2xs"
                  checked={onChecked(item)}
                  onclick={(e) => {
                    e.stopPropagation();
                  }}
                  onchange={(e) => {
                    e.stopPropagation();
                    onChange(item);
                  }}
                  style={`--checkedColor: ${item.color}`}
                />

                <span class="max-w-[160px] truncate text-sm text-ellipsis whitespace-nowrap">
                  {getItemName(item)}
                </span>
              </div>
            </button>
          {/each}
        </div>
      {:else}
        <p class="text-primary-content/50 m-2 text-sm">Nothing yet. Add one.</p>
      {/if}
    {/if}
  </div>
{/snippet}

<style>
  input[type="checkbox"]:checked {
    background-color: var(--checkedColor) !important;
  }
</style>
