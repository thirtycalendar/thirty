<script lang="ts">
  import type { Snippet } from "svelte";
  import { PanelRight } from "@lucide/svelte";
  import { cn } from "$lib/utils/cn";

  interface ModalProps {
    sidebarId: string;
    width?: string;
    className: string;
    children: Snippet;
  }

  let { sidebarId, width = "260", className, children }: ModalProps = $props();
</script>

<div class={cn(`w-[${width}px] shrink-0 bg-base-200 p-4`, className)}>
  {@render children()}
</div>
