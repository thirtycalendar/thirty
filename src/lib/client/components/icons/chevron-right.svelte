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
    stroke="currentColor"
    stroke-linecap="round"
    stroke-linejoin="round"
    stroke-width={strokeWidth}
    d="M10.75 8.75L14.25 12L10.75 15.25"
  ></path>
</svg>
