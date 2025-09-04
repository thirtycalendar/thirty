<script lang="ts">
  import type { Snippet } from "svelte";

  import type { IconSvgElement } from "@hugeicons/svelte";

  import { Icon } from "./icons";

  interface Props {
    icon: IconSvgElement;
    children: Snippet;
  }

  let { icon, children }: Props = $props();
</script>

<div class="flex items-center">
  <Icon {icon} size={14} strokeWidth={1.7} class="mr-2" absoluteStrokeWidth />
  <p class="text-sm font-semibold">
    {@render children()}
  </p>
</div>
