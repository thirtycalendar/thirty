<script lang="ts">
  import { onMount, type Snippet } from "svelte";

  import { sidebars } from "$lib/stores/sidebar";
  import { cn } from "$lib/utils/cn";

  interface SidebarProps {
    sidebarId: string;
    className?: string;
    children: Snippet;
  }

  let { sidebarId, className = "", children }: SidebarProps = $props();

  let isOpen = $derived($sidebars[sidebarId]);

  onMount(() => {
    let toggleStatus = localStorage.getItem(sidebarId);

    if (toggleStatus !== null) {
      isOpen = toggleStatus === "true";
    }
  });

  $effect(() => {
    console.log(isOpen);
  });
</script>

<div
  class={cn(
    "bg-base-200 p-4 overflow-hidden duration-300 transform",
    isOpen ? "" : "-translate-x-100 hidden",
    className,
  )}
>
  {@render children()}
</div>
