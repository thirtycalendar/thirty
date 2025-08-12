<script lang="ts">
  import { cn } from "$lib/client/utils/cn";

  interface Props {
    size?: string;
    strokeWidth?: string;
    class?: string;
  }

  let { size = "20", strokeWidth = "1.5", class: classCn }: Props = $props();
</script>

<svg
  class={cn("stroke-current", classCn)}
  width={size}
  height={size}
  fill="none"
  viewBox="0 0 24 24"
>
  <path
    fill="none"
    stroke="currentColor"
    stroke-linecap="round"
    stroke-linejoin="round"
    stroke-width={strokeWidth}
    d="M12 4v16m8-8H4"
  />
</svg>
