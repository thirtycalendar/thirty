<script lang="ts">
  import { type Snippet } from "svelte";

  import { sidebars } from "$lib/client/stores/sidebar";
  import { cn } from "$lib/client/utils/cn";

  interface Props {
    sidebarId: string;
    mainSidebar: boolean;
    class?: string;
    children: Snippet;
  }

  let { sidebarId, mainSidebar, class: classCn, children }: Props = $props();

  let isOpen = $derived($sidebars[sidebarId]);
</script>

<div
  class={cn(
    "bg-base-100 fixed top-0 z-20 h-full p-4 transition-transform duration-300",
    isOpen ? "translate-x-0" : mainSidebar ? "-translate-x-full" : "translate-x-full",
    classCn
  )}
>
  {@render children()}
</div>
