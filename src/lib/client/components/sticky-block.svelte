<script lang="ts">
  import type { IconSvgElement } from "@hugeicons/svelte";

  import type { Birthday, Event, Holiday } from "$lib/shared/types";

  import { Icon } from "./icons";

  interface StickyBlockProps<T> {
    item: T;
    color: string;
    title: string;
    onclick: (item: T) => void;
    icon?: IconSvgElement;
  }

  type StickyItem = Event | Holiday | Birthday;

  let { item, color, title, onclick: onClick, icon }: StickyBlockProps<StickyItem> = $props();

  const bgColor = $derived(`${color}33`);
</script>

<button
  class="text-primary-content border-primary-content/10 flex w-full cursor-pointer items-center gap-1.5 overflow-hidden rounded-xl border p-0 text-left shadow-sm backdrop-blur-md select-none"
  style:background-color={bgColor}
  {title}
  onclick={() => onClick(item)}
>
  <div class="h-full w-1 shrink-0" style:background-color={color}></div>
  <div class="w-full min-w-0 overflow-hidden p-0.5 text-xs font-medium">
    {#if icon}
      <div class="flex min-w-0 items-center gap-1">
        <Icon {icon} size={13} absoluteStrokeWidth />
        <p class="truncate">{title}</p>
      </div>
    {:else}
      <p class="truncate">{title}</p>
    {/if}
  </div>
</button>
