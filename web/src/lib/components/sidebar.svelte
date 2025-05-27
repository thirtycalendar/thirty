<script lang="ts">
  import { type Snippet } from "svelte";

  import { sidebars } from "$lib/stores/sidebar";
  import { cn } from "$lib/utils/cn";

  interface SidebarProps {
    sidebarId: string;
    mainSidebar: boolean;
    className?: string;
    children: Snippet;
  }

  let { sidebarId, mainSidebar, className, children }: SidebarProps = $props();
  let isOpen = $derived($sidebars[sidebarId]);
</script>

<div
  class={cn(
    "bg-base-100 p-4 h-full fixed top-0 z-20 transition-transform duration-300",
    isOpen ? "translate-x-0" : mainSidebar ? "-translate-x-full" : "translate-x-full",
    className
  )}
>
  {@render children()}
</div>
