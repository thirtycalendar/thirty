<script lang="ts">
  import { Globe, Pen } from "@lucide/svelte";

  import { handleCalendarStartEditing } from "$lib/client/stores/calendar";

  import type { Calendar } from "$lib/types";

  import { DeleteCalButton } from ".";

  interface CalendarDetailsProps {
    calendar: Calendar;
  }

  let { calendar }: CalendarDetailsProps = $props();
</script>

<div class="space-y-3">
  <h2 class="text-xl font-semibold">{calendar.name}</h2>

  <div class="flex items-start gap-3">
    <div class="pt-0.5 text-muted-foreground">
      <Globe size="20" strokeWidth="2.5" />
    </div>
    <div class="flex-1">{calendar.timezone}</div>
  </div>

  <div class="flex justify-end">
    <DeleteCalButton id={calendar.id} />

    <button class="btn btn-sm btn-square btn-ghost" onclick={handleCalendarStartEditing}>
      <Pen size="17" />
    </button>
  </div>
</div>
