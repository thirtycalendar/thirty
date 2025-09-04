<script lang="ts">
  import type { Snippet } from "svelte";

  import type { IconSvgElement } from "@hugeicons/svelte";

  import { Icon } from "./icons";

  interface Props {
    icon: IconSvgElement;
    iconClass?: string;
    size?: number;
    children: Snippet;
  }

  let { icon, iconClass = "pt-0.5", size = 20, children }: Props = $props();
</script>

<div class="flex items-start gap-3">
  <div class={iconClass}>
    <Icon {icon} strokeWidth={1.7} absoluteStrokeWidth {size} />
  </div>
  <div class="flex-1">
    {@render children()}
  </div>
</div>
