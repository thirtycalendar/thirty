<script lang="ts">
  import { onMount } from "svelte";

  import { Seo } from "$lib/client/components";
  import { DemoDarkImage, DemoLightImage } from "$lib/client/assets";

  let { data } = $props();
  let isDark = $state(false);

  onMount(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    isDark = media.matches;
    const listener = (e: MediaQueryListEvent) => (isDark = e.matches);
    media.addEventListener("change", listener);
    return () => media.removeEventListener("change", listener);
  });
</script>

<Seo seo={data.seo} />

<div class="mx-auto px-3 text-center sm:mt-16 sm:mb-8">
  <h1 class="md:text-10xl mt-12 text-6xl font-bold sm:mt-15 sm:text-[120px]">The AI Calendar</h1>
  <p class="my-6 text-sm opacity-75 sm:my-10 sm:text-xl">
    Built to keep you in flow, Thirty is the best way to organize your work and life.
  </p>
</div>

<div class="mx-auto my-12 max-w-4xl px-4 sm:my-16">
  <img
    src={isDark ? DemoDarkImage : DemoLightImage}
    alt="Thirty - AI Calendar dashboard preview"
    class="base-border border-rounded border shadow-xl"
    loading="eager"
    fetchpriority="high"
  />
</div>

<div class="text-secondary-content my-4 flex justify-center gap-3 text-sm">
  <a href="/terms" class="hover:text-primary-content">Terms of Service</a>
  <a href="/privacy" class="hover:text-primary-content">Privacy Policy</a>
</div>
