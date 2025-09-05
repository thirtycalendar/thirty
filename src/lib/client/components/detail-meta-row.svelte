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

<div class={cn("flex items-center", classCn)}>
  <Icon {icon} size={14} strokeWidth={1.7} class="mr-2" absoluteStrokeWidth />
  <p class="text-sm font-semibold">
    {@render children()}
  </p>
</div>
