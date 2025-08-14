<script lang="ts">
  import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/svelte";

  import { cn } from "$lib/client/utils/cn";

  interface Props {
    icon: IconSvgElement;
    size?: number;
    strokeWidth?: number;
    absoluteStrokeWidth?: boolean;
    class?: string;
  }

  let {
    icon,
    size = 20,
    strokeWidth = 1.5,
    absoluteStrokeWidth = false,
    class: classCn
  }: Props = $props();
</script>

<HugeiconsIcon {icon} {size} {strokeWidth} {absoluteStrokeWidth} className={cn(classCn)} />
