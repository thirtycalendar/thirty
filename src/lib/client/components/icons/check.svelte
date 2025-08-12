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
    d="M4.75 12C4.75 7.99594 7.99594 4.75 12 4.75V4.75C16.0041 4.75 19.25 7.99594 19.25 12V12C19.25 16.0041 16.0041 19.25 12 19.25V19.25C7.99594 19.25 4.75 16.0041 4.75 12V12Z"
  ></path>
  <path
    stroke="currentColor"
    stroke-linecap="round"
    stroke-linejoin="round"
    stroke-width={strokeWidth}
    d="M9.75 12.75L10.1837 13.6744C10.5275 14.407 11.5536 14.4492 11.9564 13.7473L14.25 9.75"
  ></path>
</svg>
