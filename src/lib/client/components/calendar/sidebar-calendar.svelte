<script lang="ts">
  import { derived } from "svelte/store";

  import { ArrowLeft01Icon, ArrowRight01Icon } from "@hugeicons/core-free-icons";

  import { addDays, format, isSameMonth, isToday, startOfMonth, startOfWeek } from "date-fns";

  import { currentDate, goToNextMonth, goToPreviousMonth } from "$lib/client/stores/change-date";

  import { Icon } from "../icons";

  const dayLabels = ["S", "M", "T", "W", "T", "F", "S"];

  const days = derived(currentDate, ($currentDate) => {
    const start = startOfWeek(startOfMonth($currentDate), { weekStartsOn: 0 });

    const result: Date[] = [];
    for (let i = 0; i < 42; i++) {
      result.push(addDays(start, i));
    }
    return result;
  });
</script>

<div class="my-3 w-full text-[10px] select-none">
  <div class="mb-2 flex items-center justify-between text-sm font-semibold">
    <p class="text-primary-content/90 ml-3">{format($currentDate, "MMMM yyyy")}</p>

    <div>
      <button class="btn btn-xs btn-square btn-ghost" onclick={goToPreviousMonth}>
        <Icon icon={ArrowLeft01Icon} absoluteStrokeWidth />
      </button>
      <button class="btn btn-xs btn-square btn-ghost" onclick={goToNextMonth}>
        <Icon icon={ArrowRight01Icon} absoluteStrokeWidth />
      </button>
    </div>
  </div>

  <!-- Day labels -->
  <div class="mb-1 grid grid-cols-7 gap-1 text-center opacity-50">
    {#each dayLabels as label, i (i)}
      <div>{label}</div>
    {/each}
  </div>

  <!-- Mini month grid -->
  <div class="grid grid-cols-7 gap-1 text-center">
    {#each $days as day (day)}
      <button
        class={`rounded-md py-[2px] transition-colors
          ${isToday(day) ? "bg-base-300 text-primary-content font-semibold" : ""}
          ${!isSameMonth(day, $currentDate) ? "text-base-content/30" : ""}
          hover:bg-base-300/50 cursor-pointer`}
        title={format(day, "PPP")}
        onclick={() => currentDate.set(day)}
      >
        {format(day, "d")}
      </button>
    {/each}
  </div>
</div>
