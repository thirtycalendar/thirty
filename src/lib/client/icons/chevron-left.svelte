<script lang="ts">
  import { cn } from "$lib/client/utils/cn";

  interface Props {
    size?: number;
    strokeWidth?: number;
    class?: string;
  }

  let { size = 20, strokeWidth = 1.5, class: classCn }: Props = $props();
</script>

<svg
  class={cn(classCn)}
  xmlns="http://www.w3.org/2000/svg"
  x="0px"
  y="0px"
  width={size}
  height={size}
  viewBox="0 0 24 24"
  fill="none"
>
  <path
    d="M15 6C15 6 9.00001 10.4189 9 12C8.99999 13.5812 15 18 15 18"
    stroke="currentColor"
    stroke-width={strokeWidth}
    stroke-linecap="round"
    stroke-linejoin="round"
  ></path>
</svg>
