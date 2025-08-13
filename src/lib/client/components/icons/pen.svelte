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
    d="M3.5 21.25h1.52c1.28 0 1.99 0 2.69-.29c.655-.27 1.125-.735 1.99-1.591l.1-.1l9.86-9.87c.97-.97 1.51-1.51 1.58-2.31c.01-.14.01-.29 0-.42c-.078-.793-.598-1.318-1.53-2.26l-.06-.06c-.98-.98-1.52-1.52-2.33-1.59a3 3 0 0 0-.4 0c-.82.07-1.36.61-2.33 1.59l-1.603 1.604l-.034.034L4.73 14.21l-.063.062c-.86.86-1.344 1.344-1.627 2.027c-.29.69-.29 1.4-.29 2.68v1.52c0 .41.34.75.75.75m9.99-13.7l-7.71 7.72c-.83.82-1.2 1.2-1.37 1.61s-.17.98-.17 2.1v.77h.77c1.13 0 1.69 0 2.12-.17c.4-.17.79-.55 1.56-1.33l7.75-7.75zm1.06-1.06l2.95 2.95l1.09-1.09c.68-.68 1.13-1.13 1.15-1.41v-.12c-.03-.29-.48-.74-1.16-1.42s-1.13-1.13-1.4-1.16h-.14c-.276.02-.688.437-1.369 1.128l-.031.031z"
  />
</svg>
