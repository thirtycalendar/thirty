<script lang="ts">
  import { cn } from "$lib/client/utils/cn";

  interface Props {
    size?: number;
    class?: string;
  }

  let { size = 20, class: classCn }: Props = $props();
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
    d="M9.00005 6C9.00005 6 15 10.4189 15 12C15 13.5812 9 18 9 18"
    stroke="#141B34"
    stroke-width="1.5"
    stroke-linecap="round"
    stroke-linejoin="round"
  />
</svg>
