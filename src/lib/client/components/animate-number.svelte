<script lang="ts">
  import { cubicOut } from "svelte/easing";
  import { Tween } from "svelte/motion";

  import { cn } from "../utils/cn";

  interface Props {
    value: number;
    start?: number;
    duration?: number;
    decimals?: number;
    class?: string;
  }

  const { value, start = 0, duration = 500, decimals = 0, class: classCn }: Props = $props();

  const tween = new Tween(start, {
    duration,
    easing: cubicOut
  });

  $effect(() => {
    tween.set(value);
  });
</script>

<span class={cn(classCn)}>
  {tween.current.toFixed(decimals)}
</span>
