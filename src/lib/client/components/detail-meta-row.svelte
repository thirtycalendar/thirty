<script lang="ts">
  import type { Snippet } from "svelte";

  import type { IconSvgElement } from "@hugeicons/svelte";

  import { cn } from "../utils/cn";
  import { Icon } from "./icons";

  interface Props {
    icon: IconSvgElement;
    class?: string;
    children: Snippet;
  }

  let { icon, class: classCn, children }: Props = $props();
</script>

<div class={cn("flex items-center gap-2", classCn)}>
  <Icon {icon} size={14} strokeWidth={1.3} class="ml-1 opacity-80" absoluteStrokeWidth />
  <p class="text-primary-content/80 text-sm">
    {@render children()}
  </p>
</div>
