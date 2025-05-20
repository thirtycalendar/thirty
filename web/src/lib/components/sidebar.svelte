<script lang="ts">
  import type { Snippet } from "svelte";

  import { cn } from "$lib/utils/cn";
  import { sidebars } from "$lib/stores/sidebar";

  interface SidebarProps {
    sidebarId: string;
    width?: string;
    className?: string;
    children: Snippet;
  }

  let {
    sidebarId,
    width = "260",
    className = "",
    children,
  }: SidebarProps = $props();

  let isOpen = $state(true);

  $effect(() => {
    isOpen = $sidebars[sidebarId] ?? true;
  });
</script>

<div
  class={cn(
    `transition-transform duration-300 ease-in-out w-[${width}px] shrink-0 bg-base-200 p-4`,
    isOpen ? "translate-x-0" : `-translate-x-[${width}px]`,
    className,
  )}
>
  {@render children()}
</div>
