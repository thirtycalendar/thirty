<script lang="ts">
  import { slide } from "svelte/transition";

  import { Bolt, ChevronDown, Plus } from "@lucide/svelte";

  import { createQuery } from "$lib/client/utils/query/create-query";
  import { client } from "$lib/client/utils/rpc";

  import type { Calendar } from "$lib/types";

  let { data, isPending } = createQuery({
    queryFn: async () => {
      const res = await client.api.google.calendar.getAll.$get();
      const data = await res.json();

      if (!data.success) throw new Error(data.message);
      return data.data;
    },
    queryKeys: ["cal-list"]
  });

  let showCalendars = $state(true);

  let owners = $derived($data?.filter((c) => c.accessRole === "owner") ?? []);
  let readers = $derived(
    $data?.filter((c) => c.accessRole === "reader" && !/holidays/i.test(c.summary)) ?? []
  );
  let holidays = $derived(
    $data?.filter((c) => c.accessRole === "reader" && /holidays/i.test(c.summary)) ?? []
  );
</script>

{@render CalendarList("My Calendars", owners)}
{@render CalendarList("Others", readers)}
{@render CalendarList("Holidays", holidays)}

{#snippet CalendarList(title: string, cal: Calendar[])}
  {#if cal.length > 0}
    <div class="my-2">
      <div
        class="flex items-center justify-between gap-1 px-1 text-sm font-semibold w-full rounded-md"
      >
        <p>{title}</p>

        <div>
          <button class="btn btn-xs btn-ghost btn-square">
            <Plus size="16" />
          </button>

          <button
            class={`btn btn-xs btn-ghost btn-square opacity-75 transition-transform duration-300 ${showCalendars && "rotate-180"}`}
            onclick={() => (showCalendars = !showCalendars)}
          >
            <ChevronDown size="16" />
          </button>
        </div>
      </div>

      {#if $data && showCalendars}
        <div class="my-1" transition:slide>
          {#each cal as { backgroundColor, summary }}
            {@render CalendarRow(backgroundColor, summary)}
          {/each}
        </div>
      {/if}
    </div>
  {/if}
{/snippet}

{#snippet CalendarRow(backgroundColor: string, summary: string)}
  <label class="group flex justify-between items-center hover:bg-base-200 px-1 py-[2px] rounded-md">
    <div class="flex items-center gap-2">
      <input type="checkbox" class="checkbox checkbox-xs" />
      <span
        class="text-sm truncate max-w-[160px] text-ellipsis whitespace-nowrap"
        style={`color: ${backgroundColor}`}>{summary}</span
      >
    </div>
    <button class="btn btn-ghost btn-square btn-xs opacity-75 invisible group-hover:visible">
      <Bolt size="15" />
    </button>
  </label>
{/snippet}
