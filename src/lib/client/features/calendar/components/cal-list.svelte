<script lang="ts">
  import { slide } from "svelte/transition";

  import { ChevronDown, Plus, Settings } from "@lucide/svelte";

  import { toggleModal } from "$lib/client/components/utils";
  import {
    collapsedLists,
    uncheckedBirthdays,
    uncheckedCalendars,
    uncheckedHolidays
  } from "$lib/client/stores/local-storage";
  import { birthdayModal, calendarModal, holidayCountryModal } from "$lib/client/stores/modal";

  import type { Birthday, Calendar, HolidayCountry } from "$lib/shared/types";

  import { getBirthdays } from "../../birthday/query";
  import { getHolidayCountries } from "../../holiday/query";
  import { getCalendars } from "../query";

  const { data: calendars } = getCalendars();
  const { data: birthdays } = getBirthdays();
  const { data: holidayCountries } = getHolidayCountries();

  const { store: collapsed } = collapsedLists;
</script>

{#if !$calendars}
  <div class="relative h-[200px]">
    <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/3">
      <span class="loading loading-spinner loading-md"></span>
    </div>
  </div>
{:else}
  {@render ListSection<Calendar>({
    title: "My Calendars",
    items: $calendars,
    getItemName: (item) => item.name,
    onChecked: (item) => uncheckedCalendars.isChecked(item.id),
    onChange: (item) => uncheckedCalendars.toggle(item.id),
    onAdd: () => toggleModal(calendarModal.modalId),
    onSettings: calendarModal.handleModal
  })}
{/if}

{#if $birthdays}
  {@render ListSection<Birthday>({
    title: "Birthdays",
    items: $birthdays,
    getItemName: (item) => item.name,
    onChecked: (item) => uncheckedBirthdays.isChecked(item.id),
    onChange: (item) => uncheckedBirthdays.toggle(item.id),
    onAdd: () => toggleModal(birthdayModal.modalId),
    onSettings: birthdayModal.handleModal
  })}
{/if}

{#if $holidayCountries}
  {@render ListSection<HolidayCountry>({
    title: "Holidays",
    items: $holidayCountries,
    getItemName: (item) => item.countryName,
    onChecked: (item) => uncheckedHolidays.isChecked(item.id),
    onChange: (item) => uncheckedHolidays.toggle(item.id),
    onAdd: () => toggleModal(holidayCountryModal.modalId),
    onSettings: holidayCountryModal.handleModal
  })}
{/if}

{#snippet ListSection<T extends { id: string; color: string; createdAt?: string } & object>({
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

  <div class="my-2">
    <div
      class="flex w-full items-center justify-between gap-1 rounded-md px-1 text-sm font-semibold"
    >
      <p>{title}</p>

      <div class="flex items-center gap-1">
        <div class="tooltip font-normal" data-tip="New">
          <button class="btn btn-xs btn-ghost btn-square" onclick={onAdd}>
            <Plus size="16" />
          </button>
        </div>

        <button
          class={`btn btn-xs btn-ghost btn-square opacity-75 transition-transform duration-300 ${!$collapsed.includes(title) && "rotate-180"}`}
          onclick={() => collapsedLists.toggle(title)}
        >
          <ChevronDown size="16" />
        </button>
      </div>
    </div>

    {#if !$collapsed.includes(title)}
      {#if sortedItems.length > 0}
        <div class="my-1" transition:slide>
          {#each sortedItems as item (item.id)}
            <label
              class="group hover:bg-base-200 flex cursor-pointer items-center justify-between rounded-md px-1 py-[2px]"
            >
              <div class="flex items-center gap-2">
                <input
                  type="checkbox"
                  class="checkbox checkbox-xs rounded-sm text-shadow-2xs"
                  checked={onChecked(item)}
                  onchange={() => onChange(item)}
                  style={`--checkedColor: ${item.color}`}
                />

                <span class="max-w-[160px] truncate text-sm text-ellipsis whitespace-nowrap">
                  {getItemName(item)}
                </span>
              </div>

              {#if onSettings}
                <button
                  class="btn btn-ghost btn-square btn-xs invisible opacity-75 group-hover:visible"
                  onclick={() => onSettings(item)}
                >
                  <Settings size="15" />
                </button>
              {/if}
            </label>
          {/each}
        </div>
      {:else}
        <p class="text-primary-content/70 m-1 text-sm">
          No {title.toLowerCase().replace(/s$/, "")} yet. Create one.
        </p>
      {/if}
    {/if}
  </div>
{/snippet}

<style>
  input[type="checkbox"]:checked {
    background-color: var(--checkedColor) !important;
  }
</style>
