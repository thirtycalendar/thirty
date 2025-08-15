<script lang="ts">
  import { onDestroy, onMount } from "svelte";

  import { differenceInMinutes, isToday, startOfDay } from "date-fns";

  interface Props {
    day: Date;
  }

  let { day }: Props = $props();

  let now = $state(new Date());
  let timer: ReturnType<typeof setInterval>;

  const lineOffset = $derived.by(() => {
    const minutes = differenceInMinutes(now, startOfDay(now));

    return (minutes / 60) * 60;
  });

  onMount(() => {
    timer = setInterval(() => {
      now = new Date();
    }, 60000);
  });

  onDestroy(() => {
    clearInterval(timer);
  });
</script>

{#if isToday(day)}
  <div
    class="pointer-events-none absolute right-0 left-0 z-2000 flex items-center"
    style:top="{lineOffset}px"
  >
    <div class="bg-primary-content ml-[1px] h-[8px] w-[8px] rounded-full"></div>
    <div class="bg-primary-content h-[1px] flex-1"></div>
  </div>
{/if}
