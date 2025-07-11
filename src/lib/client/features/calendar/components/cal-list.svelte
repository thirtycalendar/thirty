<script lang="ts">
  import { slide } from "svelte/transition";

  import { ChevronDown, Plus, Settings } from "@lucide/svelte";

  import { toggleModal } from "$lib/client/components/utils";
  import { birthdayCreateModalId, handleBirthdayModal } from "$lib/client/stores/birthday";
  import { calendarCreateModalId, handleCalModal } from "$lib/client/stores/calendar";
  import {
    collapsedLists,
    uncheckedBirthdays,
    uncheckedCalendars
  } from "$lib/client/stores/local-storage";

  import { getColorHexCodeFromId } from "$lib/shared/utils/colors";
  import type { Birthday, Calendar } from "$lib/shared/types";

  import { getBirthdays } from "../../birthday/query";
  import { getCalendars } from "../query";

  const { data: calendars } = getCalendars();
  const { data: birthdays } = getBirthdays();

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
    onChecked: (item) => uncheckedCalendars.isChecked(item.id),
    onChange: (item) => uncheckedCalendars.toggle(item.id),
    onAdd: () => toggleModal(calendarCreateModalId),
    onSettings: handleCalModal
  })}
{/if}

{#if $birthdays}
  {@render ListSection<Birthday>({
    title: "Birthdays",
    items: $birthdays,
    onChecked: (item) => uncheckedBirthdays.isChecked(item.id),
    onChange: (item) => uncheckedBirthdays.toggle(item.id),
    onAdd: () => toggleModal(birthdayCreateModalId),
    onSettings: handleBirthdayModal
  })}
{/if}

{#snippet ListSection<T extends Calendar | Birthday>({
  title,
  items,
  onChecked,
  onChange,
  onAdd,
  onSettings
}: {
  title: string;
  items: T[];
  onChecked: (item: T) => boolean;
  onChange: (item: T) => void;
  onAdd: () => void;
  onSettings?: (item: T) => void;
})}
  <div class="my-2">
    <div
      class="flex items-center justify-between gap-1 px-1 text-sm font-semibold w-full rounded-md"
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
      {#if items.length > 0}
        <div class="my-1" transition:slide>
          {#each items as item (item.id)}
            <label
              class="group flex justify-between items-center hover:bg-base-200 px-1 py-[2px] rounded-md cursor-pointer"
            >
              <div class="flex items-center gap-2">
                <input
                  type="checkbox"
                  class="checkbox checkbox-xs"
                  checked={onChecked(item)}
                  onchange={() => onChange(item)}
                />

                <span
                  class="text-sm truncate max-w-[160px] text-ellipsis whitespace-nowrap"
                  style={`color: ${getColorHexCodeFromId(item.colorId)}`}
                >
                  {item.name}
                </span>
              </div>

              {#if onSettings}
                <button
                  class="btn btn-ghost btn-square btn-xs opacity-75 invisible group-hover:visible"
                  onclick={() => onSettings(item)}
                >
                  <Settings size="15" />
                </button>
              {/if}
            </label>
          {/each}
        </div>
      {:else}
        <p class="text-sm m-1 text-primary-content/70">
          No {title.toLowerCase().replace(/s$/, "")} yet. Create one.
        </p>
      {/if}
    {/if}
  </div>
{/snippet}
