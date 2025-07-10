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
    class="z-2000 absolute left-0 right-0 flex items-center pointer-events-none"
    style:top="{lineOffset}px"
  >
    <div class="w-[8px] h-[8px] bg-primary-content rounded-full ml-[1px]"></div>
    <div class="h-[1px] bg-primary-content flex-1"></div>
  </div>
{/if}
