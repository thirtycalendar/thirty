<script lang="ts">
  import { onMount, type Snippet } from "svelte";

  import { onStorageKeyChange } from "$lib/utils/on-storage-key-change";
  import { cn } from "$lib/utils/cn";

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

  let isOpen = $derived(true);

  function toggleSidebar() {
    let toggleStatus = localStorage.getItem(sidebarId);

    if (toggleStatus !== null) {
      isOpen = toggleStatus === "true";
    }
  }

  onMount(() => {
    toggleSidebar();
  });

  $effect(() => {
    onStorageKeyChange(sidebarId, toggleSidebar);
  });
</script>

<div
  class={cn(
    "bg-base-200 p-4 overflow-hidden duration-300 transform",
    `w-[${width}px]`,
    isOpen ? "" : "-translate-x-100 hidden",
    className,
  )}
>
  {@render children()}
</div>
