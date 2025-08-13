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
  <g
    stroke="currentColor"
    stroke-linecap="round"
    stroke-linejoin="round"
    stroke-width={strokeWidth}
  >
    <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12s4.477 10 10 10s10-4.477 10-10" />
    <path d="M12.242 17v-5c0-.471 0-.707-.146-.854c-.147-.146-.382-.146-.854-.146m.75-3h.009" />
  </g>
</svg>
