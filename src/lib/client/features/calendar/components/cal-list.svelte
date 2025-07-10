<script lang="ts">
  import { slide } from "svelte/transition";

  import { ChevronDown, Plus, Settings } from "@lucide/svelte";

  import { toggleModal } from "$lib/client/components/utils";
  import { birthdayCreateModalId, handleBirthdayModal } from "$lib/client/stores/birthday";
  import { calendarCreateModalId, handleCalModal } from "$lib/client/stores/calendar";
  import { collapsedLists, uncheckedCalendars } from "$lib/client/stores/local-storage";

  import { getColorHexCodeFromId } from "$lib/shared/utils/colors";
  import type { Birthday, Calendar } from "$lib/shared/types";

  import { getBirthdays } from "../../birthday/query";
  import { getCalendars } from "../query";

  const { data: calendars } = getCalendars();
  const { data: birthdays } = getBirthdays();
</script>

{#if !$calendars || !$birthdays}
  <div class="relative h-[200px]">
    <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/3">
      <span class="loading loading-spinner loading-md"></span>
    </div>
  </div>
{:else}
  {@render CalendarList<Calendar>({
    title: "My Calendars",
    cal: $calendars,
    onAdd: () => toggleModal(calendarCreateModalId),
    onSettings: handleCalModal
  })}

  {@render CalendarList<Birthday>({
    title: "Birthdays",
    cal: $birthdays,
    onAdd: () => toggleModal(birthdayCreateModalId),
    onSettings: handleBirthdayModal
  })}
{/if}

{#snippet CalendarList<T extends Calendar | Birthday>({
  title,
  cal,
  onAdd,
  onSettings
}: {
  title: string;
  cal: T[];
  onAdd?: () => void;
  onSettings?: (c: T) => void;
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
          class={`btn btn-xs btn-ghost btn-square opacity-75 transition-transform duration-300 ${collapsedLists.isChecked(title) && "rotate-180"}`}
          onclick={() => collapsedLists.toggle(title)}
        >
          <ChevronDown size="16" />
        </button>
      </div>
    </div>

    {#if collapsedLists.isChecked(title) && cal.length > 0}
      <div class="my-1" transition:slide>
        {#each cal as c (c.id)}
          <label
            class="group flex justify-between items-center hover:bg-base-200 px-1 py-[2px] rounded-md cursor-pointer"
          >
            <div class="flex items-center gap-2">
              <input
                type="checkbox"
                class="checkbox checkbox-xs"
                checked={uncheckedCalendars.isChecked(c.id)}
                onchange={() => uncheckedCalendars.toggle(c.id)}
              />

              <span
                class="text-sm truncate max-w-[160px] text-ellipsis whitespace-nowrap"
                style={`color: ${getColorHexCodeFromId(c.colorId)}`}
              >
                {c.name}
              </span>
            </div>

            {#if onSettings}
              <button
                class="btn btn-ghost btn-square btn-xs opacity-75 invisible group-hover:visible"
                onclick={() => onSettings(c)}
              >
                <Settings size="15" />
              </button>
            {/if}
          </label>
        {/each}
      </div>
    {/if}
  </div>
{/snippet}
