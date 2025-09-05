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

  let { icon, iconClass = "pt-0.5", size = 20, class: classCn, children }: Props = $props();
</script>

<div class={cn("flex items-center gap-3", classCn)}>
  <div class={iconClass}>
    <Icon {icon} strokeWidth={1.7} absoluteStrokeWidth {size} />
  </div>
  <div class="flex-1">
    {@render children()}
  </div>
</div>
