<script lang="ts">
  import type { Snippet } from "svelte";

  import type { IconSvgElement } from "@hugeicons/svelte";

  import { cn } from "../utils/cn";
  import { Icon } from "./icons";

  interface Props {
    icon: IconSvgElement;
    iconClass?: string;
    size?: number;
    class?: string;
    children: Snippet;
  }

  let { icon, iconClass, size = 20, class: classCn, children }: Props = $props();
</script>

<div class={cn("flex items-center justify-between gap-3", classCn)}>
  <div class={cn(iconClass)}>
    <Icon {icon} strokeWidth={1.7} class="opacity-80" absoluteStrokeWidth {size} />
  </div>
  <div class="text-primary-content/80 flex-1">
    {@render children()}
  </div>
</div>
